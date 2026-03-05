import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute = () => {
    const { session, isLoading, initialize } = useAuthStore()
    const location = useLocation()

    useEffect(() => {
        initialize()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        )
    }

    if (!session) {
        // Redirect to login but save the attempted url
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    return <Outlet />
}

export const PublicRoute = () => {
    const { session, isLoading, initialize } = useAuthStore()

    useEffect(() => {
        initialize()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        )
    }

    // If logged in, don't let them see the login page again
    if (session) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Outlet />
}
