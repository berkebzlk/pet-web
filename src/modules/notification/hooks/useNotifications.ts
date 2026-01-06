import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notificationService } from '../services/notification.service';

export const useNotifications = (limit = 20) => {
    return useQuery({
        queryKey: ['notifications', limit],
        queryFn: () => notificationService.getAll(limit),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 30000,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
export const useListenForNotifications = (userId: number | undefined) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.listen('.match.request.cancelled', (e: any) => {
            console.log('Match request cancelled:', e);

            // Optimistically update the notifications list
            queryClient.setQueryData(['notifications'], (oldData: any) => {
                if (!oldData) return oldData;
                return oldData.filter((notification: any) => notification.data?.match_id !== e.matchId);
            });

            // Also invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        });

        return () => {
            channel.stopListening('.match.request.cancelled');
        };
    }, [userId, queryClient]);
};
