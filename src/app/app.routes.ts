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
  { path: '**', redirectTo: '' },
];
