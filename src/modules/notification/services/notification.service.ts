import { api } from '@/shared/lib/api';

export interface Notification {
    id: string;
    type: string;
    data: {
        match_id?: number;
        sender_pet_id?: number;
        sender_pet_name?: string;
        sender_pet_image?: string;
        accepter_pet_id?: number;
        accepter_pet_name?: string;
        accepter_pet_image?: string;
        message?: string;
        [key: string]: any;
    };
    read_at: string | null;
    created_at: string;
}

export const notificationService = {
    getAll: async (limit = 20) => {
        const response = await api.get('/notifications', { params: { limit } });
        return response.data.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data.data.count;
    },

    markAsRead: async (id: string) => {
        const response = await api.post(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('/notifications/mark-all-read');
        return response.data;
    }
};
