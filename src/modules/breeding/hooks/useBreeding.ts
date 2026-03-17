import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { breedingService } from '../services/breeding.service';
import type { CreateBreedingConnectionDto } from '../types';

export const useBreedingDiscovery = (petId: number, params?: { per_page?: number; page?: number; gender?: string; exclude_connected?: boolean }) => {
    return useQuery({
        queryKey: ['breeding-discover', petId, params],
        queryFn: () => breedingService.discover(petId, params),
        enabled: !!petId,
    });
};

export const usePendingBreedingRequests = (petId: number) => {
    return useQuery({
        queryKey: ['breeding-pending', petId],
        queryFn: () => breedingService.getPendingRequests(petId),
        enabled: !!petId,
    });
};

export const useBreedingConnections = (petId: number, params?: any) => {
    return useQuery({
        queryKey: ['breeding-connections', petId, params],
        queryFn: () => breedingService.getConnections(petId, params),
        enabled: !!petId,
    });
};

export const useCreateBreedingRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBreedingConnectionDto) => breedingService.createRequest(data),
        onSuccess: () => {
            toast.success('Breeding request sent successfully!');
            queryClient.invalidateQueries({ queryKey: ['breeding-discover'] });
            queryClient.invalidateQueries({ queryKey: ['breeding-pending'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send breeding request');
        },
    });
};

export const useAcceptBreedingRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => breedingService.acceptRequest(id),
        onSuccess: () => {
            toast.success('Breeding request accepted! You can now message them.');
            queryClient.invalidateQueries({ queryKey: ['breeding-pending'] });
            queryClient.invalidateQueries({ queryKey: ['breeding-connections'] });
            // Invalidate social connections too, since one was created behind the scenes!
            queryClient.invalidateQueries({ queryKey: ['socialConnections'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to accept request');
        },
    });
};

export const useRejectBreedingRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => breedingService.rejectRequest(id),
        onSuccess: () => {
            toast.success('Breeding request rejected.');
            queryClient.invalidateQueries({ queryKey: ['breeding-pending'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        },
    });
};

export const useCancelBreedingRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => breedingService.cancelRequest(id),
        onSuccess: () => {
            toast.success('Breeding request cancelled.');
            queryClient.invalidateQueries({ queryKey: ['breeding-pending'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel request');
        },
    });
};
