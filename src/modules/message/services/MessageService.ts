import { api } from '@/shared/lib/api';
import type { Pet } from '@/modules/pet/types/pet.types';

export interface Message {
    id: number;
    sender_pet_id: number;
    receiver_pet_id: number;
    content: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    sender?: Pet;
    receiver?: Pet;
}

export interface SendMessagePayload {
    receiver_pet_id: number;
    content: string;
}

export const MessageService = {
    getMessages: async (petId: number, otherPetId: number): Promise<Message[]> => {
        const response = await api.get(`/messages/${petId}/${otherPetId}`);
        // Backend returns wrapped response { success: true, data: { data: [...messages], ...pagination } }
        // api.get usually returns AxiosResponse.
        // If interceptor doesn't unwrap: response.data.data.data
        // Let's assume response.data is the body. body.data is the paginator. paginator.data is the messages array.
        return response.data.data?.data || [];
    },

    sendMessage: async (petId: number, payload: SendMessagePayload): Promise<Message> => {
        const response = await api.post(`/messages/${petId}`, payload);
        return response.data.data;
    },

    getConversations: async (petId: number): Promise<Message[]> => {
        const response = await api.get(`/messages/conversations/${petId}`);
        // Similar to getMessages, extract data from paginator
        return response.data.data?.data || [];
    },

    getUnreadCount: async (petId: number): Promise<number> => {
        const response = await api.get(`/messages/unread-count/${petId}`);
        return response.data.data.count;
    },

    markAsRead: async (petId: number, otherPetId: number): Promise<void> => {
        await api.post(`/messages/mark-as-read/${petId}/${otherPetId}`);
    },
};
