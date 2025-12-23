import type { RouteObject } from 'react-router-dom';
import { MatchPage } from './pages/MatchPage';
import { PetDetailPage } from './pages/PetDetailPage';

export const matchRoutes: RouteObject[] = [
    {
        path: 'match',
        element: <MatchPage />,
    },
    {
        path: 'match/:id',
        element: <PetDetailPage />,
    },
];
