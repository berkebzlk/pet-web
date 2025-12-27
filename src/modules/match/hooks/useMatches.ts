import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService } from '../services/match.service';
import { toast } from 'sonner';

export const usePendingMatches = (petId: number | undefined) => {
    return useQuery({
        queryKey: ['matches', 'pending', petId],
        queryFn: () => matchService.getPendingMatches(petId!),
        enabled: !!petId,
    });
};

export const useAcceptMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: matchService.accept,
        onSuccess: () => {
            toast.success('Match accepted!');
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to accept match.');
        }
    });
};

export const useRejectMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: matchService.reject,
        onSuccess: () => {
            toast.success('Match rejected.');
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reject match.');
        }
    });
};

export const useCheckMatchStatus = (initiatorPetId: number | undefined, targetPetId: number | undefined) => {
    return useQuery({
        queryKey: ['matches', 'status', initiatorPetId, targetPetId],
        queryFn: () => matchService.checkStatus(initiatorPetId!, targetPetId!),
        enabled: !!initiatorPetId && !!targetPetId,
    });
};
