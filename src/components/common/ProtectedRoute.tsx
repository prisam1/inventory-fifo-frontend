import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';  

const ProtectedRoute: React.FC = () => {
  const { authState } = useAuth();

  if (authState.loading) {
    return <Spinner />;  
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;