import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Check, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'tr', name: 'Türkçe (Turkish)' },
    { code: 'en', name: 'English (English)' },
];

export function LanguageSelectionPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLanguageSelect = (langCode: string) => {
        i18n.changeLanguage(langCode);
        navigate(-1);
    };

    return (
        <div className="h-full bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('settings.language')}</h1>
            </header>

            <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t('settings.searchLanguage')}
                        className="pl-9 bg-muted/50 border-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Language List */}
                <div className="space-y-1">
                    {filteredLanguages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg cursor-pointer"
                        >
                            <span className="font-medium text-sm">{lang.name}</span>
                            {i18n.language === lang.code && (
                                <Check className="w-5 h-5 text-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
