import { Routes } from '@angular/router';
import { RouteCounterService } from './scope-explorer/counter-services';
import {
  AdminRouteLab,
  LibraryRouteLab,
} from './scope-explorer/route-counter-lab';
import { DependencyInjectionPage } from './dependency-injection-page';

export const DEPENDENCY_INJECTION_ROUTES: Routes = [
  {
    path: '',
    component: DependencyInjectionPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'library' },
      {
        path: 'library',
        component: LibraryRouteLab,
        providers: [RouteCounterService],
        title: 'Alcance de ruta library · Dependency Injection',
      },
      {
        path: 'admin',
        component: AdminRouteLab,
        providers: [RouteCounterService],
        title: 'Alcance de ruta admin · Dependency Injection',
      },
    ],
  },
];
