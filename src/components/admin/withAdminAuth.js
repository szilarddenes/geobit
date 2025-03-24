import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/auth';
import LoadingState from '@/components/LoadingState';
import { AdminLogin } from '@/pages/admin/login';

/**
 * Higher Order Component to protect admin routes
 * Will redirect to login page if user is not authenticated
 */
export default function withAdminAuth(Component) {
    const ProtectedRoute = (props) => {
        const { user, loading, isAdmin } = useAuth();
        const router = useRouter();

        // Redirect logic if not admin or logged in
        useEffect(() => {
            if (!loading && !user && router.pathname !== '/admin') {
                // If not logged in, redirect to admin login
                router.push('/admin');
            }
        }, [loading, user, router]);

        // Show loading state while checking auth
        if (loading) {
            return <LoadingState message="Authenticating..." />;
        }

        // If not logged in, show login page
        if (!user) {
            return <AdminLogin />;
        }

        // If logged in but not admin, show access denied in the AdminLogin component
        if (!isAdmin) {
            return <AdminLogin />;
        }

        // If user is admin, render the protected component
        return <Component {...props} />;
    };

    // Copy getInitialProps to allow data fetching
    if (Component.getInitialProps) {
        ProtectedRoute.getInitialProps = Component.getInitialProps;
    }

    return ProtectedRoute;
} 