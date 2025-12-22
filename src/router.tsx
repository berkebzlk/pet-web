import { createBrowserRouter } from 'react-router-dom';
import { LandingLayout } from './shared/components/layout/LandingLayout';
import { AppLayout } from './shared/components/layout/AppLayout';
import { AuthLayout } from './modules/auth/layouts/AuthLayout';
import { ProtectedRoute } from './shared/components/auth/ProtectedRoute';
import { GuestRoute } from './shared/components/auth/GuestRoute';
import { HomePage } from './modules/home/pages/HomePage';
import { DashboardPage } from './modules/dashboard/pages/DashboardPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                element: <GuestRoute />, // Wrapped auth routes with GuestRoute
                children: [
                    {
                        path: 'login', // Path is relative to /auth
                        element: <LoginPage />,
                    },
                    {
                        path: 'register', // Path is relative to /auth
                        element: <RegisterPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                ],
            },
        ],
    },
]);
