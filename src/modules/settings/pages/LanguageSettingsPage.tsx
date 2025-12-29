import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function LanguageSettingsPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const appName = import.meta.env.VITE_APP_NAME || 'PetMet';

    const currentLanguageName = i18n.language === 'tr' ? 'Türkçe' : 'English';

    return (
        <div className="h-full bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('settings.language')}</h1>
            </header>

            <div className="py-6">
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider mb-2">
                        {t('settings.appLanguage', { appName })}
                    </h3>
                    <div className="bg-card border-y border-border">
                        <button
                            onClick={() => navigate('/app/settings/language/selection')}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-sm">{currentLanguageName}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
