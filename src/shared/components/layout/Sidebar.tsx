import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Heart, Store, Calendar, User, LogOut } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import { PetSwitcher } from '@/modules/pet/components/PetSwitcher';

export function Sidebar() {
    const { t } = useTranslation();
    const { mutate: logout, isPending } = useLogout();

    const navItems = [
        {
            to: '/app',
            icon: Home,
            label: t('nav.home'),
            end: true,
        },
        {
            to: '/app/match',
            icon: Heart,
            label: t('nav.match'),
        },
        {
            to: '/app/services',
            icon: Store,
            label: t('nav.services'),
        },
        {
            to: '/app/care',
            icon: Calendar,
            label: t('nav.care'),
        },
        {
            to: '/app/profile',
            icon: User,
            label: t('nav.profile'),
        },
    ];

    return (
        <aside className="w-64 border-r bg-card hidden md:flex flex-col fixed inset-y-0 z-50">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="font-bold text-xl text-primary">PetMet</span>
            </div>

            <div className="p-4 pb-0">
                <PetSwitcher />
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
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => logout()}
                    disabled={isPending}
                >
                    <LogOut className="h-4 w-4" />
                    <span>{t('auth.logout.button')}</span>
                </Button>
            </div>
        </aside>
    );
}
