import { Outlet } from 'react-router-dom';
import { useMatchNotifications } from '@/modules/match/hooks/useMatchNotifications';
import { ScrollToTop } from '../utils/ScrollToTop';

export const RootLayout = () => {
    useMatchNotifications();

    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    );
};
