import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Heart, Store, Calendar, User, Plus, Check, Compass, Baby, Stethoscope } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useState, useRef } from 'react';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { Modal } from '@/shared/components/ui/modal';
import { VeterinaryForm } from '@/modules/veterinary/components/VeterinaryForm';


export function BottomNav() {
    const { t } = useTranslation();
    const { activePet, setActivePet, pets } = useActivePet();
    const { data: user } = useAuthUser();

    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAddVetOpen, setIsAddVetOpen] = useState(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);

    const handleStart = () => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setIsDropdownOpen(true);
        }, 500); // 500ms for long press
    };

    const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (isLongPress.current) {
            e.preventDefault();
        }
    };

    const isClinicActive = activePet && 'clinicName' in activePet;

    const navItems = isClinicActive ? [
        {
            to: '/app/veterinarians',
            icon: Stethoscope,
            label: t('nav.veterinarians'),
        },
    ] : [
        {
            to: '/app',
            icon: Home,
            label: t('nav.home'),
            end: true,
        },
        {
            to: '/app/discover',
            icon: Compass,
            label: t('nav.discover'),
        },
        {
            to: '/app/breeding',
            icon: Baby,
            label: t('nav.breeding'),
        },
        {
            to: '/app/veterinarians',
            icon: Stethoscope,
            label: t('nav.veterinarians'),
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe md:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )
                        }
                    >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <div className="relative">
                        <div
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                                location.pathname.startsWith('/app/profile')
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onTouchStart={handleStart}
                            onTouchEnd={handleEnd}
                            onMouseDown={handleStart}
                            onMouseUp={handleEnd}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!isLongPress.current) {
                                    navigate('/app/profile');
                                }
                            }}
                        >
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={(activePet && 'clinicName' in activePet) ? activePet.profilePhoto : activePet?.image || undefined} className="object-cover" />
                                <AvatarFallback className="text-[10px]">
                                    {(activePet && 'clinicName' in activePet) ? (
                                        <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                                    ) : activePet?.name?.[0] || (
                                        <User className="h-4 w-4" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <span>{t('nav.profile')}</span>
                        </div>
                        <DropdownMenuTrigger className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
                    </div>
                    <DropdownMenuContent align="end" className="w-56" side="top">
                        <DropdownMenuLabel>{t('profile.myPets')}</DropdownMenuLabel>
                        {pets.map((pet) => (
                            <DropdownMenuItem
                                key={pet.id}
                                onClick={() => {
                                    setActivePet(pet);
                                    window.location.reload();
                                }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={pet.image || undefined} className="object-cover" />
                                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate max-w-[120px]">{pet.name}</span>
                                </div>
                                {activePet && !('clinicName' in activePet) && activePet.id === pet.id && <Check className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => navigate('/app/pets/new')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('pet.add')}
                        </DropdownMenuItem>

                        {user?.veterinaryProfile ? (
                            <>
                                <hr className="my-1 border-t" />
                                <DropdownMenuLabel>Klinik</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setActivePet(user.veterinaryProfile);
                                        window.location.reload();
                                    }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.veterinaryProfile.profilePhoto || undefined} className="object-cover" />
                                            <AvatarFallback>
                                                <Stethoscope className="h-4 w-4 text-teal-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="truncate max-w-[120px]">{user.veterinaryProfile.clinicName}</span>
                                    </div>
                                    {activePet && 'clinicName' in activePet && activePet.id === user.veterinaryProfile.id && <Check className="h-4 w-4 text-teal-600" />}
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <hr className="my-1 border-t" />
                                <DropdownMenuItem onClick={() => setIsAddVetOpen(true)} className="text-teal-600 cursor-pointer font-semibold">
                                    <Stethoscope className="mr-2 h-4 w-4 text-teal-600" />
                                    Veteriner Profili Oluştur
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Modal
                    isOpen={isAddVetOpen}
                    onClose={() => setIsAddVetOpen(false)}
                    title="Veteriner Profili Oluştur"
                >
                    <VeterinaryForm
                        onSuccess={() => {
                            setIsAddVetOpen(false);
                            window.location.reload();
                        }}
                    />
                </Modal>
            </div>
        </nav>
    );
}
