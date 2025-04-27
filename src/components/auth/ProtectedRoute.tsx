
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has one of those roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user?.role === 'tutor') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
