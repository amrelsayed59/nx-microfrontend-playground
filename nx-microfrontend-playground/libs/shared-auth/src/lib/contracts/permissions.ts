import type { CurrentUser, UserRole } from '../models/user.model';

/**
 * The full set of permissions across the platform. Naming convention is
 * `<domain>:<action>` so new domains slot in cleanly.
 */
export type Permission =
  | 'product:create'
  | 'product:update'
  | 'product:delete'
  | 'order:create'
  | 'order:update'
  | 'order:delete';

/**
 * Role → permissions matrix. This is the single source of truth for
 * authorization, shared by the host and every remote so the rules cannot drift
 * between frameworks.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  Admin: [
    'product:create',
    'product:update',
    'product:delete',
    'order:create',
    'order:update',
    'order:delete',
  ],
  Manager: ['product:create', 'product:update', 'order:create', 'order:update'],
  Viewer: [],
};

/** Pure permission check against the matrix. */
export function userHasPermission(
  user: CurrentUser | null,
  permission: Permission
): boolean {
  if (!user) {
    return false;
  }
  return ROLE_PERMISSIONS[user.role].includes(permission);
}
