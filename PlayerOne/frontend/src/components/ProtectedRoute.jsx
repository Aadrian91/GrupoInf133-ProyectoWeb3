import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, requiredRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" />;
  }

  if (requiredRole) {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== requiredRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;