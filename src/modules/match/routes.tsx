import type { RouteObject } from 'react-router-dom';
import { MatchPage } from './pages/MatchPage';
import { PetDetailPage } from './pages/PetDetailPage';
import { MyMatchesPage } from './pages/MyMatchesPage';

export const matchRoutes: RouteObject[] = [
    {
        path: 'match',
        element: <MatchPage />,
    },
    {
        path: 'matches',
        element: <MyMatchesPage />,
    },
    {
        path: 'match/:id',
        element: <PetDetailPage />,
    },
];
