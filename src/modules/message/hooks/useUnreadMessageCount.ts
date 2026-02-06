import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageService } from '../services/MessageService';

export const useUnreadMessageCount = (petId: number | undefined) => {
    return useQuery({
        queryKey: ['unreadMessageCount', petId],
        queryFn: () => MessageService.getUnreadCount(petId!),
        enabled: !!petId,
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useMarkMessagesAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ petId, otherPetId }: { petId: number; otherPetId: number }) =>
            MessageService.markAsRead(petId, otherPetId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['unreadMessageCount', variables.petId],
            });
            queryClient.invalidateQueries({
                queryKey: ['messages', variables.petId, variables.otherPetId],
            });
        },
    });
};
