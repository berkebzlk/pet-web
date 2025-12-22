import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'TR' : 'EN'}
        </Button>
    );
}
