import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Heart, Store, Calendar, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function BottomNav() {
    const { t } = useTranslation();

    const navItems = [
        {
            to: '/app',
            icon: Home,
            label: t('nav.home'),
            end: true, // Exact match for home
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
                                    : 'text-muted-foreground hover:text-foreground'
                            )
                        }
                    >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
