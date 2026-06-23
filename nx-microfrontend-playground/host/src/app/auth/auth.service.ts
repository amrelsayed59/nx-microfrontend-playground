import { Injectable, computed, inject, signal } from '@angular/core';
import {
  clearSession,
  getCurrentUser,
  setSession,
  userHasPermission,
  type CurrentUser,
  type Permission,
  type UserRole,
} from '@org/shared-auth';
import { AuthApi, type LoginCredentials } from './auth-api';

/**
 * The host owns authentication. This service is the single writer of session
 * state: it validates credentials through {@link AuthApi}, persists the session
 * via the shared-auth contract (localStorage + `auth-changed` broadcast), and
 * exposes reactive signals for the host's own UI and guards.
 *
 * Remotes never see this service — they read the same session through the
 * framework-agnostic `@org/shared-auth` helpers.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);

  // Initialised from persisted storage so a page refresh keeps the user logged in.
  private readonly _currentUser = signal<CurrentUser | null>(getCurrentUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  async login(credentials: LoginCredentials): Promise<boolean> {
    const user = await this.api.login(credentials);
    if (!user) {
      return false;
    }
    setSession(user); // persist + broadcast to remotes
    this._currentUser.set(user);
    return true;
  }

  async logout(): Promise<void> {
    await this.api.logout();
    clearSession(); // clear + broadcast to remotes
    this._currentUser.set(null);
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }

  hasPermission(permission: Permission): boolean {
    return userHasPermission(this._currentUser(), permission);
  }
}
