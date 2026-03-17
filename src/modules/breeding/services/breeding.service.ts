import { api } from '@/shared/lib/api';
import type { BreedingConnection, CreateBreedingConnectionDto } from '../types';

export const breedingService = {
    discover: async (petId: number, params?: { per_page?: number; page?: number; gender?: string; exclude_connected?: boolean }) => {
        const { data } = await api.get<any>('/breeding/discover', {
            params: { pet_id: petId, ...params }
        });
        return data;
    },

    getPendingRequests: async (petId: number) => {
        const { data } = await api.get<any>('/breeding/pending', {
            params: { pet_id: petId }
        });
        return data.data || [];
    },

    getConnections: async (petId: number, params?: any) => {
        const { data } = await api.get<any>(`/breeding/${petId}`, { params });
        return data.data || [];
    },

    createRequest: async (dto: CreateBreedingConnectionDto) => {
        const { data } = await api.post<BreedingConnection>('/breeding/request', dto);
        return data;
    },

    acceptRequest: async (id: number) => {
        const { data } = await api.post<BreedingConnection>(`/breeding/${id}/accept`);
        return data;
    },

    rejectRequest: async (id: number) => {
        const { data } = await api.post(`/breeding/${id}/reject`);
        return data;
    },

    cancelRequest: async (id: number) => {
        const { data } = await api.delete(`/breeding/${id}`);
        return data;
    },
};
