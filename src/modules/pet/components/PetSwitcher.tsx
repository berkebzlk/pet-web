import { useActivePet } from '../context/ActivePetContext';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, PawPrint } from 'lucide-react';
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

export function PetSwitcher() {
    const { activePet, setActivePet, pets, isLoading } = useActivePet();
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (isLoading) return null;

    if (pets.length === 0) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/app/pets/new')}
            >
                <Plus className="h-4 w-4" />
                {t('pet.add')}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between px-3 h-12">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {activePet?.image ? (
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
                                {activePet?.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate w-full text-left">
                                {activePet?.breed || t(`pet.types.${activePet?.type}`)}
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
                        <span className={activePet?.id === pet.id ? "font-bold" : ""}>
                            {pet.name}
                        </span>
                        {activePet?.id === pet.id && (
                            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="gap-2 cursor-pointer text-primary focus:text-primary"
                    onClick={() => navigate('/app/pets/new')}
                >
                    <Plus className="h-4 w-4" />
                    {t('pet.add')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
