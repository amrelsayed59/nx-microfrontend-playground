import { Route } from '@angular/router';
import { Home } from './home/home';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./products-remote.component').then(
        (m) => m.ProductsRemoteComponent
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./orders-remote.component').then((m) => m.OrdersRemoteComponent),
  },
];
