import { useEffect, useRef } from 'react';
import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '@/shared/lib/echo';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface MessageSentEvent {
    id: number;
    sender_pet_id: number;
    sender_name: string;
    content: string;
    created_at: string;
}

export const useMessageListener = () => {
    const { activePet } = useActivePet();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const locationRef = useRef(location);

    useEffect(() => {
        locationRef.current = location;
    }, [location]);

    useEffect(() => {
        if (!activePet) return;

        const channel = echo.private(`pet.${activePet.id}`);

        channel.listen('.message.sent', (data: MessageSentEvent) => {
            // Update react-query cache
            queryClient.invalidateQueries({ queryKey: ['unreadMessageCount', activePet.id] });
            queryClient.invalidateQueries({ queryKey: ['conversations', activePet.id] });
            // Also invalidate messages if we are in that chat? 
            // Better: 'messages' query handles its own refetch or we can optimistic update here. 
            // For now simplest is invalidate.
            queryClient.invalidateQueries({ queryKey: ['messages', activePet.id, data.sender_pet_id] });

            // Show Toast if we are NOT in the chat with this sender
            const currentPath = locationRef.current.pathname;
            const isInChat = currentPath === `/app/messages/${data.sender_pet_id}`;

            if (!isInChat) {
                toast.success(`New message from ${data.sender_name}`, {
                    description: data.content,
                    action: {
                        label: 'View',
                        onClick: () => navigate(`/app/messages/${data.sender_pet_id}`)
                    }
                });
            }
        });

        return () => {
            channel.stopListening('.message.sent');
        };
    }, [activePet, queryClient, navigate]);
};
