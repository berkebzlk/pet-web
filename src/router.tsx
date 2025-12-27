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
import { ProfilePage } from './modules/profile/pages/ProfilePage';
import { AddPetPage } from './modules/pet/pages/AddPetPage';
import { matchRoutes } from './modules/match/routes';
import { ServicesPage } from './modules/services/pages/ServicesPage';
import { CarePage } from './modules/care/pages/CarePage';

import { RootLayout } from './shared/components/layout/RootLayout';

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
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
                        element: <GuestRoute />,
                        children: [
                            {
                                path: 'login',
                                element: <LoginPage />,
                            },
                            {
                                path: 'register',
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
                            {
                                path: 'profile',
                                element: <ProfilePage />,
                            },
                            {
                                path: 'pets/new',
                                element: <AddPetPage />,
                            },
                            ...matchRoutes,
                            {
                                path: 'services',
                                element: <ServicesPage />,
                            },
                            {
                                path: 'care',
                                element: <CarePage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
