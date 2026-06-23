import { publishAppEvent, subscribeAppEvent } from '@org/shared-models';
import type { AuthSession, CurrentUser } from '../models/user.model';
import type { Permission } from '../contracts/permissions';
import { userHasPermission } from '../contracts/permissions';

/**
 * Framework-agnostic session contract shared by the Angular host and the React
 * and Vue remotes.
 *
 * The source of truth is `localStorage` (one per origin, readable by every
 * federated bundle), and change notifications ride the existing cross-framework
 * event bus (`auth-changed`). This is why the *code* here can be safely
 * duplicated across bundles — all copies read the same storage and the same
 * window events.
 *
 * The HOST writes (setSession / clearSession via its AuthService); REMOTES only
 * read (getCurrentUser / isAuthenticated / hasPermission) and react to changes
 * (onAuthChanged). No Angular service ever crosses a framework boundary.
 */
const SESSION_STORAGE_KEY = 'nova.auth.session';

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): CurrentUser | null {
  return getSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasPermission(permission: Permission): boolean {
  return userHasPermission(getCurrentUser(), permission);
}

/**
 * Persist a session and broadcast the change. Called by the host on successful
 * login. Writing here is the only "write" path remotes never touch.
 */
export function setSession(user: CurrentUser): void {
  const session: AuthSession = { user };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  publishAppEvent('auth-changed', { authenticated: true });
}

/** Clear the session and broadcast. Called by the host on logout. */
export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  publishAppEvent('auth-changed', { authenticated: false });
}

/**
 * Subscribe to auth changes (login/logout). Returns an unsubscribe function.
 * Remotes use this to re-read the session reactively. Also listens to the
 * native `storage` event so changes in another tab propagate too.
 */
export function onAuthChanged(handler: () => void): () => void {
  const unsubscribeBus = subscribeAppEvent('auth-changed', () => handler());
  const storageListener = (event: StorageEvent): void => {
    if (event.key === SESSION_STORAGE_KEY) {
      handler();
    }
  };
  window.addEventListener('storage', storageListener);
  return () => {
    unsubscribeBus();
    window.removeEventListener('storage', storageListener);
  };
}
