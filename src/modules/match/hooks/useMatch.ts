import { useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService, type CreateMatchDTO } from '../services/match.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCreateMatch = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (data: CreateMatchDTO) => matchService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] }); // If we have a matches list
            toast.success(t('match.requestSent'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('match.requestFailed'));
        },
    });
};
