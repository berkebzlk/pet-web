import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';

export function ProtectedRoute() {
    const { data: user, isLoading } = useAuthUser();
    const location = useLocation();

    if (isLoading) {
        // TODO: Add a proper loading spinner
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
