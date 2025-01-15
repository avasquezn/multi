import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../actions/authContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location, unauthorized: true }} replace />;
  }

  return element;
};

export default ProtectedRoute;