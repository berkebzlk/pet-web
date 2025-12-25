import { api } from '@/shared/lib/api';

export interface CreateMatchDTO {
    initiator_pet_id: number;
    target_pet_id: number;
}

export const matchService = {
    create: async (data: CreateMatchDTO) => {
        const response = await api.post('/matches', data);
        return response.data;
    },
};
