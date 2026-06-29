import { api } from '@/shared/lib/api';
import type { CreateVeterinaryProfileDTO } from '../types/veterinary.types';

export const veterinaryService = {
    createProfile: async (data: CreateVeterinaryProfileDTO) => {
        const formData = new FormData();
        
        if (data.clinicName) formData.append('clinic_name', data.clinicName);
        if (data.city) formData.append('city', data.city);
        if (data.phone) formData.append('phone', data.phone);
        if (data.website) formData.append('website', data.website);
        if (data.about) formData.append('about', data.about);
        
        if (data.specialties && data.specialties.length > 0) {
            data.specialties.forEach((spec, index) => {
                formData.append(`specialties[${index}]`, spec);
            });
        }
        
        if (data.profilePhoto) {
            formData.append('profile_photo', data.profilePhoto);
        }
        if (data.coverPhoto) {
            formData.append('cover_photo', data.coverPhoto);
        }

        const response = await api.post('/veterinary-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAll: async (params?: any) => {
        const response = await api.get('/veterinarians', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/veterinarians/${id}`);
        return response.data;
    },

    getPosts: async (id: number) => {
        const response = await api.get(`/veterinarians/${id}/posts`);
        return response.data;
    },

    getCities: async (): Promise<string[]> => {
        const response = await api.get('/veterinarians/cities');
        return response.data.data;
    },

    getReviews: async (id: number): Promise<any[]> => {
        const response = await api.get(`/veterinarians/${id}/reviews`);
        return response.data.data;
    },

    addReview: async (id: number, data: { pet_id: number; rating: number; comment?: string }): Promise<any> => {
        const response = await api.post(`/veterinarians/${id}/reviews`, data);
        return response.data.data;
    },
};
