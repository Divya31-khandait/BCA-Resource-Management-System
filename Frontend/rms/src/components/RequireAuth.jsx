import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RequireAuth({ children, role }) {
  const { role: userRole } = useAuth();
  if (!userRole) return <Navigate to="/login" replace />;
  if (userRole !== role && userRole !== 'admin') return <Navigate to="/login" replace />;
  return children;
}