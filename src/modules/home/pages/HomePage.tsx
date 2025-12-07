import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

export function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
            <h1 className="text-4xl font-bold">{t('common.welcome')}</h1>
            <p className="text-muted-foreground">
                {t('common.description')}
            </p>
            <Button asChild>
                <Link to="/app">{t('common.getStarted')}</Link>
            </Button>
        </div>
    );
}
