import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ComponentLoading } from '../../common/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <ComponentLoading message="Authenticating..." />;
  }

  return user ? children : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
