import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/pet.service';
import type { CreatePetDTO, UpdatePetDTO } from '../types/pet.types';
import { toast } from 'sonner';

export const usePets = (params?: any) => {
    return useQuery({
        queryKey: ['pets', params],
        queryFn: () => petService.getAll(params),
    });
};

export const useMyPets = (params?: any) => {
    return useQuery({
        queryKey: ['my-pets', params],
        queryFn: () => petService.getMyPets(params),
    });
};

export const usePet = (id: number) => {
    return useQuery({
        queryKey: ['pet', id],
        queryFn: () => petService.getById(id),
        enabled: !!id,
    });
};

export const useCreatePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePetDTO) => petService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['my-pets'] });
            toast.success('Pet created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create pet');
        },
    });
};

export const useUpdatePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePetDTO }) =>
            petService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['my-pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', id] });
            toast.success('Pet updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update pet');
        },
    });
};

export const useDeletePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => petService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['my-pets'] });
            toast.success('Pet deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete pet');
        },
    });
};
