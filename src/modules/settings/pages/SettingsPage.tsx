import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft, User, Bookmark, Archive, Lock, Users, Ban, EyeOff, Plus, LogOut, Globe } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import { useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import { PetForm } from '@/modules/pet/components/PetForm';

export function SettingsPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();
    const [isAddPetOpen, setIsAddPetOpen] = useState(false);

    const handleCloseModal = () => {
        setIsAddPetOpen(false);
    };

    const SettingGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider">{title}</h3>
            <div className="bg-card border-y border-border divide-y divide-border">
                {children}
            </div>
        </div>
    );

    const SettingItem = ({ icon: Icon, label, onClick, isDestructive = false }: { icon: any, label: string, onClick?: () => void, isDestructive?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer ${isDestructive ? 'text-destructive' : ''}`}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{label}</span>
            </div>
            {!isDestructive && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
    );

    return (
        <div className="h-full bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate('/app/profile')} className="p-1 -ml-2 hover:bg-muted rounded-full cursor-pointer">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('profile.settings')}</h1>
            </header>

            <div className="py-6 space-y-8">
                {/* Hesabın */}
                <SettingGroup title={t('settings.account')}>
                    <SettingItem
                        icon={User}
                        label={t('settings.accountsCenter')}
                        onClick={() => navigate('/app/settings/accounts-center')}
                    />
                </SettingGroup>

                {/* Etkileşimler */}
                <SettingGroup title={t('settings.interactions')}>
                    <SettingItem icon={Bookmark} label={t('settings.saved')} />
                    <SettingItem icon={Archive} label={t('settings.archive')} />
                </SettingGroup>

                {/* İçeriklerini kimler görebilir? */}
                <SettingGroup title={t('settings.privacy')}>
                    <SettingItem icon={Lock} label={t('settings.accountPrivacy')} />
                    <SettingItem icon={Users} label={t('settings.closeFriends')} />
                    <SettingItem icon={Ban} label={t('settings.blocked')} />
                    <SettingItem icon={EyeOff} label={t('settings.hideStory')} />
                </SettingGroup>

                {/* Uygulama */}
                <SettingGroup title={t('settings.application')}>
                    <SettingItem
                        icon={Globe}
                        label={t('settings.language')}
                        onClick={() => navigate('/app/settings/language')}
                    />
                </SettingGroup>

                {/* Actions */}
                <div className="space-y-2 px-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-12"
                        onClick={() => setIsAddPetOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                        {t('settings.addPet')}
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2 h-12"
                        onClick={() => logout()}
                    >
                        <LogOut className="w-5 h-5" />
                        {t('settings.logout')}
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isAddPetOpen}
                onClose={handleCloseModal}
                title={t('pet.add')}
            >
                <PetForm
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </div>
    );
}
