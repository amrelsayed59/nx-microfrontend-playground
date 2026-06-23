import { Injectable } from '@angular/core';
import type { CurrentUser, UserRole } from '@org/shared-auth';
import { AuthApi, type LoginCredentials } from './auth-api';

interface MockUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
}

const MOCK_USERS: readonly MockUser[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'manager', password: 'manager123', role: 'Manager' },
  { id: 3, username: 'viewer', password: 'viewer123', role: 'Viewer' },
];

const SIMULATED_LATENCY_MS = 400;

/**
 * Mock implementation of {@link AuthApi}. Validates credentials against an
 * in-memory user list and returns the public `CurrentUser` (never the
 * password). Replace with an HTTP implementation later — `AuthService` and all
 * remotes are unaffected.
 */
@Injectable()
export class MockAuthService extends AuthApi {
  override login(credentials: LoginCredentials): Promise<CurrentUser | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const match = MOCK_USERS.find(
          (user) =>
            user.username === credentials.username.trim() &&
            user.password === credentials.password
        );
        resolve(
          match
            ? { id: match.id, username: match.username, role: match.role }
            : null
        );
      }, SIMULATED_LATENCY_MS);
    });
  }

  override logout(): Promise<void> {
    // A real implementation would POST /logout to invalidate the server session.
    return Promise.resolve();
  }
}
