import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route protection owned by the host. Unauthenticated users are redirected to
 * `/login`; authenticated users pass through. Guards run before the remote is
 * loaded, so a remote bundle is never even fetched for an unauthenticated user.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
