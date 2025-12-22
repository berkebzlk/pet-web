import { api } from '@/shared/lib/api';
import type { LoginSchema, RegisterSchema } from '../schemas/auth.schema';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const authService = {
    login: async (data: LoginSchema) => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return response.data.data;
    },

    register: async (data: RegisterSchema) => {
        const response = await api.post<ApiResponse<null>>('/auth/register', data);
        return response.data.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
    },

    me: async () => {
        const response = await api.post<ApiResponse<User>>('/auth/me');
        return response.data.data;
    },
};
