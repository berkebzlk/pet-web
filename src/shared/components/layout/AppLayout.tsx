import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';

export function AppLayout() {
    const { t } = useTranslation();
    const { mutate: logout, isPending } = useLogout();

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r bg-muted/40 p-4 hidden md:flex flex-col">
                <div className="font-bold text-xl mb-6">PetMet App</div>
                <nav className="space-y-2 flex-1">
                    <div className="px-2 py-1 text-sm font-medium">Dashboard</div>
                    {/* Add more sidebar items here */}
                </nav>
                <div className="border-t pt-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => logout()}
                        disabled={isPending}
                    >
                        {t('auth.logout.button')}
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
