import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/shared/components/ui/language-switcher';

export function AuthLayout() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <header className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-coral">
                    PetMet
                </Link>
                <LanguageSwitcher />
            </header>
            <main className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6">
                    <Outlet />
                </div>
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} PetMet. {t('common.allRightsReserved')}
            </footer>
        </div>
    );
}
