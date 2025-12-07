import { createBrowserRouter } from 'react-router-dom';
import { LandingLayout } from '@/shared/components/layout/LandingLayout';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { homeRoutes } from '@/modules/home/routes';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';

export const router = createBrowserRouter([
    {
        element: <LandingLayout />,
        children: [
            ...homeRoutes,
        ],
    },
    {
        path: '/app',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        ],
    },
]);
