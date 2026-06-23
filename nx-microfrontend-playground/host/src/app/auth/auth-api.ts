import type { CurrentUser } from '@org/shared-auth';

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Authentication API boundary. `AuthService` depends on this abstraction, never
 * on a concrete implementation — so swapping `MockAuthService` for an
 * HTTP-backed implementation (POST /login, GET /me, POST /logout) is a single
 * provider change and touches no consumer.
 *
 * Methods are async (Promise-based) precisely so a real network implementation
 * is a drop-in replacement without changing call sites.
 */
export abstract class AuthApi {
  abstract login(credentials: LoginCredentials): Promise<CurrentUser | null>;
  abstract logout(): Promise<void>;
}
