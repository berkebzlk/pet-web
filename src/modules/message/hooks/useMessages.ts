import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageService, type SendMessagePayload } from '../services/MessageService';

export const useMessages = (petId: number, otherPetId: number) => {
    return useQuery({
        queryKey: ['messages', petId, otherPetId],
        queryFn: () => MessageService.getMessages(petId, otherPetId),
        enabled: !!petId && !!otherPetId,
        refetchInterval: 5000, // Simple polling for now
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ petId, payload }: { petId: number; payload: SendMessagePayload }) =>
            MessageService.sendMessage(petId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['messages', variables.petId, variables.payload.receiver_pet_id],
            });
        },
    });
};
