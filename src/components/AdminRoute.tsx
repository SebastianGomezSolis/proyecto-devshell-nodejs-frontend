import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSesion } from '../utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const sesion = getSesion();
  if (!sesion) return <Navigate to="/login" replace />;
  if (sesion.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;
