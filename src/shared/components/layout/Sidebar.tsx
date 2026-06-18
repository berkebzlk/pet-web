import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Heart, Store, Calendar, User, LogOut, Plus, Check, Inbox, Compass, Baby, Stethoscope } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useLogout, useAuthUser } from '@/modules/auth/hooks/useAuth';
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
import { Modal } from '@/shared/components/ui/modal';
import { VeterinaryForm } from '@/modules/veterinary/components/VeterinaryForm';

export function Sidebar() {
    const { t } = useTranslation();
    const { mutate: logout } = useLogout();
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
            to: '/app/messages',
            icon: Inbox,
            label: t('message.inbox'),
        },
        {
            to: '/app/veterinarians',
            icon: Stethoscope,
            label: t('nav.veterinarians'),
        },
    ];

    return (
        <aside className="w-64 border-r bg-card hidden md:flex flex-col fixed inset-y-0 z-50">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="font-bold text-xl text-primary">PetMet</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )
                        }
                    >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <div className="relative">
                        <div
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 h-auto font-medium rounded-md cursor-pointer transition-colors',
                                location.pathname.startsWith('/app/profile')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                                <AvatarFallback>
                                    {(activePet && 'clinicName' in activePet) ? (
                                        <Stethoscope className="h-4 w-4 text-teal-600" />
                                    ) : activePet?.name?.[0] || (
                                        <User className="h-4 w-4" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <span>{t('nav.profile')}</span>
                        </div>
                        <DropdownMenuTrigger className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
                    </div>
                    <DropdownMenuContent align="start" className="w-56" side="right">
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
            </nav>

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

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => logout()}
                >
                    <LogOut className="h-4 w-4" />
                    <span>{t('auth.logout.button')}</span>
                </Button>
            </div>
        </aside>
    );
}

