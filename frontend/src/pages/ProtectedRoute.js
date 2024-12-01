import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;