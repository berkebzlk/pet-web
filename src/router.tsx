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
import { PublicProfilePage } from './modules/profile/pages/PublicProfilePage';
import { MatchRequestsPage } from './modules/match/pages/MatchRequestsPage';
import { NotificationsPage } from './modules/notification/pages/NotificationsPage';
import { SettingsPage } from './modules/settings/pages/SettingsPage';
import { AccountsCenterPage } from './modules/settings/pages/AccountsCenterPage';
import { PersonalDetailsPage } from './modules/settings/pages/PersonalDetailsPage';
import { PetsListPage } from './modules/settings/pages/PetsListPage';
import { PetDetailPage } from './modules/pet/pages/PetDetailPage';
import { EditPetPage } from './modules/pet/pages/EditPetPage';
import { AddPetPage } from './modules/pet/pages/AddPetPage';
import { LanguageSettingsPage } from './modules/settings/pages/LanguageSettingsPage';
import { LanguageSelectionPage } from './modules/settings/pages/LanguageSelectionPage';
import { ChatPage } from './modules/message/pages/ChatPage';
import { InboxPage } from './modules/message/pages/InboxPage';
import { matchRoutes } from './modules/match/routes';
import { ServicesPage } from './modules/services/pages/ServicesPage';
import { CarePage } from './modules/care/pages/CarePage';
import { PostFeedPage } from './modules/post/pages/PostFeedPage';
import DiscoverPage from './modules/discover/pages/DiscoverPage';
import { breedingRoutes } from './modules/breeding/routes';

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
                                path: 'profile/:username',
                                element: <PublicProfilePage />,
                            },
                            {
                                path: 'match-requests',
                                element: <MatchRequestsPage />,
                            },
                            {
                                path: 'notifications',
                                element: <NotificationsPage />,
                            },
                            {
                                path: 'settings',
                                children: [
                                    {
                                        index: true,
                                        element: <SettingsPage />,
                                    },
                                    {
                                        path: 'accounts-center',
                                        children: [
                                            {
                                                index: true,
                                                element: <AccountsCenterPage />,
                                            },
                                            {
                                                path: 'personal-details',
                                                element: <PersonalDetailsPage />,
                                            },
                                            {
                                                path: 'pets',
                                                children: [
                                                    {
                                                        index: true,
                                                        element: <PetsListPage />,
                                                    },
                                                    {
                                                        path: ':id',
                                                        element: <PetDetailPage />,
                                                    },
                                                    {
                                                        path: ':id/edit',
                                                        element: <EditPetPage />,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        path: 'language',
                                        children: [
                                            {
                                                index: true,
                                                element: <LanguageSettingsPage />,
                                            },
                                            {
                                                path: 'selection',
                                                element: <LanguageSelectionPage />,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                path: 'pets/new',
                                element: <AddPetPage />,
                            },
                            {
                                path: 'messages',
                                element: <InboxPage />,
                            },
                            {
                                path: 'messages/:petId',
                                element: <ChatPage />,
                            },
                            ...matchRoutes,
                            {
                                path: 'breeding',
                                children: breedingRoutes,
                            },
                            {
                                path: 'services',
                                element: <ServicesPage />,
                            },
                            {
                                path: 'care',
                                element: <CarePage />,
                            },
                            {
                                path: 'care',
                                element: <CarePage />,
                            },
                            {
                                path: 'posts',
                                element: <PostFeedPage />,
                            },
                            {
                                path: 'discover',
                                element: <DiscoverPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
