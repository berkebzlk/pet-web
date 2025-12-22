import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';

export function GuestRoute() {
    const { data: user, isLoading } = useAuthUser();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (user) {
        // Redirect to dashboard or the page they came from
        const from = location.state?.from?.pathname || '/app';
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
}
