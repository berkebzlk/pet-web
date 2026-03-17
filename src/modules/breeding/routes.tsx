import type { RouteObject } from 'react-router-dom';
import { BreedingDashboard } from './pages/BreedingDashboard';
import { BreedingDetailPage } from './pages/BreedingDetailPage';
import { BreedingRequestsPage } from './pages/BreedingRequestsPage';
import { BreedingConnectionsPage } from './pages/BreedingConnectionsPage';

export const breedingRoutes: RouteObject[] = [
    {
        path: '',
        element: <BreedingDashboard />,
    },
    {
        path: 'requests',
        element: <BreedingRequestsPage />,
    },
    {
        path: 'connections',
        element: <BreedingConnectionsPage />,
    },
    {
        path: ':id',
        element: <BreedingDetailPage />,
    }
];
