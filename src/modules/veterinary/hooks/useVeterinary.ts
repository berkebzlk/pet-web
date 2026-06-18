import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { veterinaryService } from '../services/veterinary.service';
import type { CreateVeterinaryProfileDTO } from '../types/veterinary.types';
import { toast } from 'sonner';

export const useCreateVeterinaryProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVeterinaryProfileDTO) => veterinaryService.createProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            queryClient.invalidateQueries({ queryKey: ['veterinarians'] });
            toast.success('Veteriner profili başarıyla oluşturuldu');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Profil oluşturulamadı');
        },
    });
};

export const useVeterinarians = (params?: any) => {
    return useQuery({
        queryKey: ['veterinarians', params],
        queryFn: () => veterinaryService.getAll(params),
    });
};

export const useVeterinaryProfile = (id: number) => {
    return useQuery({
        queryKey: ['veterinaryProfile', id],
        queryFn: () => veterinaryService.getById(id),
        enabled: !!id,
    });
};

export const useVeterinaryPosts = (id: number) => {
    return useQuery({
        queryKey: ['veterinaryPosts', id],
        queryFn: () => veterinaryService.getPosts(id),
        enabled: !!id,
    });
};
