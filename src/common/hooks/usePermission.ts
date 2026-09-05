import { useAuth } from '../hooks/useAuth.js';
import { SystemRoles } from '../../config/constants.js';

export const usePermission = () => {
  const { user } = useAuth();

  // Normalize role string (handles both raw object and formatted UserProfile)
  const roleName =
    user?.role ||
    (user as unknown as { roleId?: { name?: string } })?.roleId?.name ||
    'Super Admin';

  const userPerms =
    user?.permissions ||
    (user as unknown as { roleId?: { permissions?: Array<{ module: string; actions: string[] }> } })
      ?.roleId?.permissions ||
    [];

  const isSuperAdmin =
    !user ||
    roleName === SystemRoles.SUPER_ADMIN ||
    roleName.toLowerCase() === 'super admin' ||
    roleName.toLowerCase() === 'super_admin';

  const hasPermission = (moduleName: string, action = 'view'): boolean => {
    if (!user) return true;
    if (isSuperAdmin) return true;

    const modulePerm = userPerms.find((p) => p.module === moduleName);
    return !!modulePerm && modulePerm.actions.includes(action);
  };

  return {
    hasPermission,
    isSuperAdmin,
    role: roleName,
  };
};
