import { api } from '@/shared/lib/api';
import { CreatePetDTO, Pet, UpdatePetDTO } from '../types/pet.types';

export const petService = {
    getAll: async (params?: any) => {
        const response = await api.get('/pet', { params });
        return response.data;
    },

    getMyPets: async (params?: any) => {
        const response = await api.get('/my-pets', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/pet/${id}`);
        return response.data;
    },

    create: async (data: CreatePetDTO) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value instanceof File ? value : String(value));
                }
            }
        });

        const response = await api.post('/pet', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: number, data: UpdatePetDTO) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value instanceof File ? value : String(value));
                }
            }
        });
        // Laravel requires _method=PUT for multipart/form-data updates
        formData.append('_method', 'PUT');

        const response = await api.post(`/pet/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/pet/${id}`);
        return response.data;
    },
};
