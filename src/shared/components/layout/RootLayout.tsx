import { Outlet } from 'react-router-dom';
import { ScrollToTop } from '../utils/ScrollToTop';

export const RootLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    );
};
