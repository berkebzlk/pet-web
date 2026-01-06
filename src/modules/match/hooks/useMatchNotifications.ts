import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { echo } from '@/shared/lib/echo';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

export const useMatchNotifications = () => {
    const { data: user } = useAuthUser();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user?.id) return;

        const channel = echo.private(`App.Models.User.${user.id}`);

        channel.listen('.match.request.sent', (e: any) => {
            toast.info(t('match.requestReceived', { petName: e.match.initiator_pet.name }), {
                action: {
                    label: t('common.view'),
                    onClick: () => navigate('/app/matches')
                }
            });

            // Invalidate pending matches for the target pet
            queryClient.invalidateQueries({ queryKey: ['matches', 'pending', e.match.target_pet_id] });
            // Also invalidate notifications
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        });

        channel.listen('.match.request.cancelled', (e: any) => {
            console.log('Match request cancelled (MatchNotifications):', e);

            // Optimistically update pending matches list
            queryClient.setQueryData(['matches', 'pending', e.targetPetId], (oldData: any) => {
                if (!oldData) return oldData;
                return oldData.filter((match: any) => match.id !== e.matchId);
            });

            // Invalidate to be safe
            queryClient.invalidateQueries({ queryKey: ['matches', 'pending', e.targetPetId] });
        });

        return () => {
            channel.stopListening('.match.request.sent');
            channel.stopListening('.match.request.cancelled');
        };
    }, [user?.id, t, queryClient, navigate]);
};
