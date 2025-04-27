
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import TutorDashboard from './TutorDashboard';
import AdminDashboard from './AdminDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case 'student':
      return <StudentDashboard />;
    case 'tutor':
      return <TutorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
