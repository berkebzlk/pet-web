import { api } from '@/shared/lib/api';

export interface CreateMatchDTO {
    initiator_pet_id: number;
    target_pet_id: number;
}

import type { Match } from '../types';

export const matchService = {
    create: async (data: CreateMatchDTO) => {
        const response = await api.post('/matches', data);
        return response.data;
    },

    getPendingMatches: async (petId: number): Promise<Match[]> => {
        const response = await api.get('/matches/pending', { params: { pet_id: petId } });
        return response.data.data;
    },

    accept: async (matchId: number) => {
        const response = await api.post(`/matches/${matchId}/accept`);
        return response.data;
    },

    reject: async (matchId: number) => {
        const response = await api.post(`/matches/${matchId}/reject`);
        return response.data;
    },

    cancel: async (matchId: number) => {
        const response = await api.delete(`/matches/${matchId}`);
        return response.data;
    },

    checkStatus: async (initiatorPetId: number, targetPetId: number): Promise<Match | null> => {
        const response = await api.get('/matches/check', {
            params: { initiator_pet_id: initiatorPetId, target_pet_id: targetPetId }
        });
        return response.data.data;
    },

    getMatches: async (petId: number, params: { search?: string; page?: number; per_page?: number } = {}) => {
        const response = await api.get(`/matches/${petId}`, { params });
        return response.data;
    },
};
