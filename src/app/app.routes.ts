import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
    title: 'Angular Atlas',
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./features/components/components-page').then((m) => m.ComponentsPage),
    title: 'Componentes y ciclo de vida · Angular Atlas',
  },
  {
    path: 'signals',
    loadComponent: () => import('./features/signals/signals-page').then((m) => m.SignalsPage),
    title: 'Signals · Angular Atlas',
  },
  {
    path: 'routing',
    loadChildren: () => import('./features/routing/routing.routes').then((m) => m.ROUTING_ROUTES),
    title: 'Routing y Lazy Loading · Angular Atlas',
  },
  {
    path: 'dependency-injection',
    loadChildren: () =>
      import('./features/dependency-injection/dependency-injection.routes').then(
        (m) => m.DEPENDENCY_INJECTION_ROUTES,
      ),
    title: 'Dependency Injection · Angular Atlas',
  },
  {
    path: 'http',
    loadChildren: () => import('./features/http/http.routes').then((m) => m.HTTP_ROUTES),
    title: 'HTTP y recursos · Angular Atlas',
  },
  { path: '**', redirectTo: '' },
];
