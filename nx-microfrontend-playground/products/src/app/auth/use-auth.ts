import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentUser,
  hasPermission,
  onAuthChanged,
  type CurrentUser,
  type Permission,
} from '@org/shared-auth';

/**
 * React binding over the framework-agnostic auth session contract. Reads the
 * current user from `@org/shared-auth` (backed by the host's session) and
 * re-renders when the host broadcasts login/logout via `auth-changed`.
 *
 * The remote never owns auth — it only reads this shared contract.
 */
export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(getCurrentUser());

  useEffect(() => onAuthChanged(() => setUser(getCurrentUser())), []);

  const can = useCallback(
    (permission: Permission): boolean => hasPermission(permission),
    // Re-create when the user changes so consumers re-evaluate after login/out.
    [user]
  );

  return { user, isAuthenticated: user !== null, can };
}
