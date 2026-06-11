import { Route } from '@angular/router';
import { Home } from './home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products-remote.component').then(
        (m) => m.ProductsRemoteComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders-remote.component').then((m) => m.OrdersRemoteComponent),
  },
];
