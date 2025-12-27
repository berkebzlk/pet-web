import { Outlet } from 'react-router-dom';
import { useMatchNotifications } from '@/modules/match/hooks/useMatchNotifications';

export const RootLayout = () => {
    useMatchNotifications();

    return <Outlet />;
};
