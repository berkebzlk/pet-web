import { useActivePet } from '../context/ActivePetContext';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, PawPrint, Stethoscope } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import { VeterinaryForm } from '@/modules/veterinary/components/VeterinaryForm';

export function PetSwitcher() {
    const { activePet, setActivePet, pets, isLoading } = useActivePet();
    const { data: user } = useAuthUser();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isAddVetOpen, setIsAddVetOpen] = useState(false);

    if (isLoading) return null;

    const isClinicActive = activePet && 'clinicName' in activePet;

    if (pets.length === 0 && !user?.veterinaryProfile) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/app/pets/new')}
                >
                    <Plus className="h-4 w-4" />
                    {t('pet.add')}
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-teal-500/30 text-teal-600 hover:bg-teal-50/50"
                    onClick={() => setIsAddVetOpen(true)}
                >
                    <Stethoscope className="h-4 w-4 text-teal-600" />
                    Klinik Profili Ekle
                </Button>
                <Modal
                    isOpen={isAddVetOpen}
                    onClose={() => setIsAddVetOpen(false)}
                    title="Veteriner Profili Oluştur"
                >
                    <VeterinaryForm
                        onSuccess={() => setIsAddVetOpen(false)}
                    />
                </Modal>
            </div>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between px-3 h-12">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                {isClinicActive ? (
                                    activePet.profilePhoto ? (
                                        <img
                                            src={activePet.profilePhoto}
                                            alt={activePet.clinicName}
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <Stethoscope className="h-4 w-4 text-teal-600" />
                                    )
                                ) : activePet?.image ? (
                                    <img
                                        src={activePet.image}
                                        alt={activePet.name}
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                ) : (
                                    <PawPrint className="h-4 w-4 text-primary" />
                                )}
                            </div>
                            <div className="flex flex-col items-start truncate">
                                <span className="text-sm font-medium truncate w-full text-left">
                                    {isClinicActive ? activePet.clinicName : activePet?.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate w-full text-left">
                                    {isClinicActive ? 'Klinik Profili' : (activePet?.breed || t(`pet.types.${activePet?.type}`))}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>{t('pet.myPets')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {pets.map((pet) => (
                        <DropdownMenuItem
                            key={pet.id}
                            onClick={() => setActivePet(pet)}
                            className="gap-2 cursor-pointer"
                        >
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                {pet.image ? (
                                    <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-primary">{pet.name[0]}</span>
                                )}
                            </div>
                            <span className={activePet?.id === pet.id && !isClinicActive ? "font-bold" : ""}>
                                {pet.name}
                            </span>
                            {activePet?.id === pet.id && !isClinicActive && (
                                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                            )}
                        </DropdownMenuItem>
                    ))}

                    {user?.veterinaryProfile && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Klinik</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => setActivePet(user.veterinaryProfile)}
                                className="gap-2 cursor-pointer"
                            >
                                <div className="h-6 w-6 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden">
                                    {user.veterinaryProfile.profilePhoto ? (
                                        <img src={user.veterinaryProfile.profilePhoto} alt={user.veterinaryProfile.clinicName} className="h-full w-full object-cover" />
                                    ) : (
                                        <Stethoscope className="h-3 w-3 text-teal-600" />
                                    )}
                                </div>
                                <span className={isClinicActive ? "font-bold text-teal-600" : ""}>
                                    {user.veterinaryProfile.clinicName}
                                </span>
                                {isClinicActive && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-teal-600" />
                                )}
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="gap-2 cursor-pointer text-primary focus:text-primary"
                        onClick={() => navigate('/app/pets/new')}
                    >
                        <Plus className="h-4 w-4" />
                        {t('pet.add')}
                    </DropdownMenuItem>

                    {!user?.veterinaryProfile && (
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-teal-600 focus:text-teal-600 font-semibold"
                            onClick={() => setIsAddVetOpen(true)}
                        >
                            <Stethoscope className="h-4 w-4 text-teal-600" />
                            Klinik Profili Oluştur
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                isOpen={isAddVetOpen}
                onClose={() => setIsAddVetOpen(false)}
                title="Veteriner Profili Oluştur"
            >
                <VeterinaryForm
                    onSuccess={() => setIsAddVetOpen(false)}
                />
            </Modal>
        </>
    );
}
