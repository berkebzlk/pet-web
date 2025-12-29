import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, User } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export function AccountsCenterPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const SettingGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider">{title}</h3>
            <div className="bg-card border-y border-border divide-y divide-border">
                {children}
            </div>
        </div>
    );

    const SettingItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
    );

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('accountsCenter.title')}</h1>
            </header>

            <div className="py-6 space-y-8">
                {/* Petler */}
                <SettingGroup title={t('accountsCenter.petsTitle')}>
                    <SettingItem
                        icon={User}
                        label={t('accountsCenter.pets')}
                        onClick={() => navigate('/app/settings/accounts-center/pets')}
                    />
                </SettingGroup>

                {/* Account Settings */}
                <SettingGroup title={t('accountsCenter.accountSettings')}>
                    <SettingItem icon={Shield} label={t('accountsCenter.passwordSecurity')} />
                    <SettingItem
                        icon={User}
                        label={t('accountsCenter.personalDetails')}
                        onClick={() => navigate('/app/settings/accounts-center/personal-details')}
                    />
                </SettingGroup>
            </div>
        </div>
    );
}
