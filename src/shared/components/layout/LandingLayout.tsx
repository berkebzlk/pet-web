import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { LanguageSwitcher } from '@/shared/components/ui/language-switcher';

export function LandingLayout() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        PetMet
                    </div>
                    <nav className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Button asChild>
                            <Link to="/app">{t('common.goToApp')}</Link>
                        </Button>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} PetMet. All rights reserved.
            </footer>
        </div>
    );
}
