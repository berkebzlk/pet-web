import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Backend error response structure
export interface ApiErrorResponse {
    success: boolean;
    error_code: string;
    message: string;
    errors?: Record<string, string[]>;
}

// Create axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://petmet.local/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && !config.url?.endsWith('/auth/login')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // 1. Validation Errors (422)
        // We let react-hook-form handle these by rejecting the promise with the data
        if (status === 422) {
            return Promise.reject(error);
        }

        // 2. Auth Errors (401)
        if (status === 401) {
            // Redirect to login
            // We use window.location to ensure a full refresh/clear if needed, 
            // or we could use a custom event to trigger router navigation.
            if (!window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login';
            }
            return Promise.reject(error);
        }

        // 3. Global Errors (500, 403, Network Errors, etc.)
        const message = data?.message || error.message || 'Something went wrong';
        toast.error(message);

        return Promise.reject(error);
    }
);
