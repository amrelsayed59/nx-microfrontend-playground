import { onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';
import {
  getCurrentUser,
  hasPermission,
  onAuthChanged,
  type CurrentUser,
  type Permission,
} from '@org/shared-auth';

export interface UseAuth {
  user: Ref<CurrentUser | null>;
  can: (permission: Permission) => boolean;
}

/**
 * Vue binding over the framework-agnostic auth session contract. Reads the
 * current user from `@org/shared-auth` (backed by the host's session) and
 * updates reactively when the host broadcasts login/logout via `auth-changed`.
 *
 * The remote never owns auth — it only reads this shared contract.
 */
export function useAuth(): UseAuth {
  const user = ref<CurrentUser | null>(getCurrentUser());
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = onAuthChanged(() => {
      user.value = getCurrentUser();
    });
  });

  onUnmounted(() => unsubscribe?.());

  function can(permission: Permission): boolean {
    return hasPermission(permission);
  }

  return { user, can };
}
