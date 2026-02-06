import { useQuery } from '@tanstack/react-query';
import { MessageService } from '../services/MessageService';

export const useConversations = (petId: number | undefined) => {
    return useQuery({
        queryKey: ['conversations', petId],
        queryFn: () => MessageService.getConversations(petId!),
        enabled: !!petId,
    });
};
