import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { matchService, type CreateMatchDTO } from '../services/match.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCreateMatch = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (data: CreateMatchDTO) => matchService.create(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['match', 'status', variables.initiator_pet_id, variables.target_pet_id] });
            toast.success(t('match.requestSent') || "Match request sent!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('match.requestFailed') || "Failed to send match request");
        },
    });
};

export const useCheckMatchStatus = (initiatorPetId: number | undefined, targetPetId: number | undefined) => {
    return useQuery({
        queryKey: ['match', 'status', initiatorPetId, targetPetId],
        queryFn: () => matchService.checkStatus(initiatorPetId!, targetPetId!),
        enabled: !!initiatorPetId && !!targetPetId,
        staleTime: 0,
    });
};

export const useAcceptMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId: number) => matchService.accept(matchId),
        onSuccess: () => {
            toast.success("Match accepted!");
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['match', 'status'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to accept match");
        }
    });
};

export const useRejectMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId: number) => matchService.reject(matchId),
        onSuccess: () => {
            toast.success("Match rejected");
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['match', 'status'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reject match");
        }
    });
};

export const useCancelMatch = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (matchId: number) => matchService.cancel(matchId),
        onSuccess: () => {
            toast.success(t('match.requestCancelled') || "Match request cancelled");
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['match', 'status'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to cancel match request");
        }
    });
};
export const usePendingMatches = (petId: number | undefined) => {
    return useQuery({
        queryKey: ['matches', 'pending', petId],
        queryFn: () => matchService.getPendingMatches(petId!),
        enabled: !!petId,
        staleTime: 0,
    });
};

export const useGetMatches = (petId: number | undefined, params: { search?: string; page?: number; per_page?: number } = {}, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['matches', petId, params],
        queryFn: () => matchService.getMatches(petId!, params),
        enabled: !!petId && enabled,
    });
};
