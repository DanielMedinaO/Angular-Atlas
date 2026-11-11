import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
    title: 'Angular Atlas',
  },
  {
    path: 'signals',
    loadComponent: () => import('./features/signals/signals-page').then((m) => m.SignalsPage),
    title: 'Signals · Angular Atlas',
  },
];
