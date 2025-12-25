import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            queryClient.setQueryData(['authUser'], data.user);
            navigate('/app');
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            // Usually register doesn't return token immediately in some APIs, 
            // but if it does (auto-login), store it. 
            // Based on AuthResource, it seems we might not get a token on register?
            // Let's check AuthController.register... it returns null data.
            // So we should probably redirect to login or auto-login.
            // For now, let's assume it redirects to login or we need to login manually.
            // Wait, looking at AuthController.php:
            // return ResponseHelper::success(null, 201, __('auth.register_successful'));
            // It returns null. So no token.
            navigate('/auth/login');
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('activePetId');
            queryClient.clear(); // Clear all cache to prevent data leaking between users
            navigate('/auth/login');
        },
    });
};

export const useAuthUser = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: authService.me,
        retry: false,
        staleTime: 1000 * 60 * 30, // 30 mins
    });
};
