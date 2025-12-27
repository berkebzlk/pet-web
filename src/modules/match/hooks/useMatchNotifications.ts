import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { echo } from '@/shared/lib/echo';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useMatchNotifications = () => {
    const { data: user } = useAuthUser();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;

        const channel = echo.private(`user.${user.id}`);

        channel.listen('.match.request.sent', (e: any) => {
            toast.info(t('match.requestReceived', { petName: e.match.initiator_pet.name }), {
                action: {
                    label: t('common.view'),
                    onClick: () => navigate('/app/matches')
                }
            });
        });

        return () => {
            channel.stopListening('.match.request.sent');
        };
    }, [user?.id, t]);
};
