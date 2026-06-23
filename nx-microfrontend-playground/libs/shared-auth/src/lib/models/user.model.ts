export type UserRole = 'Admin' | 'Manager' | 'Viewer';

/**
 * The authenticated user as seen by every part of the platform. Deliberately
 * minimal and framework-agnostic — no tokens, no password. Mirrors what a real
 * `GET /me` endpoint would return.
 */
export interface CurrentUser {
  id: number;
  username: string;
  role: UserRole;
}

/**
 * The persisted session envelope. Today it only carries the user; when a real
 * backend is wired in, `token`/`expiresAt` are added here without changing
 * consumers that read `user`.
 */
export interface AuthSession {
  user: CurrentUser;
  // token?: string;       // future: JWT / opaque session token
  // expiresAt?: number;   // future: expiry epoch ms
}
