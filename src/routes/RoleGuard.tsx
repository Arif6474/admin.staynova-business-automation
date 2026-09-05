import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../common/hooks/usePermission.js';

export interface RoleGuardProps {
  module: string;
  action?: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  module,
  action = 'view',
  children,
}) => {
  const { hasPermission, isSuperAdmin } = usePermission();

  if (!isSuperAdmin && !hasPermission(module, action)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
