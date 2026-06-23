import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { AuthApi } from './auth/auth-api';
import { MockAuthService } from './auth/mock-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    // Swap MockAuthService for an HTTP implementation here to go live —
    // nothing else changes.
    { provide: AuthApi, useClass: MockAuthService },
  ],
};
