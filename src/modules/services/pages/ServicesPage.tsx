import { useTranslation } from 'react-i18next';

export function ServicesPage() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <h1 className="text-2xl font-bold">{t('nav.services')}</h1>
            <p className="text-muted-foreground">Coming Soon...</p>
        </div>
    );
}
