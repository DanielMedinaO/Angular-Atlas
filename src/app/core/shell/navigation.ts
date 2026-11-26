interface NavItemBase {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export interface AvailableNavItem extends NavItemBase {
  readonly status: 'available';
  readonly path: string;
}

export interface UpcomingNavItem extends NavItemBase {
  readonly status: 'upcoming';
}

export type NavItem = AvailableNavItem | UpcomingNavItem;

export interface NavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavItem[];
}

// To enable a topic: register its route in app.routes.ts, then switch its entry
// from `status: 'upcoming'` to `status: 'available'` and add its `path`.
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'start',
    label: 'Comenzar',
    items: [
      {
        id: 'home',
        label: 'Inicio',
        description: 'Visión general de Angular Atlas',
        status: 'available',
        path: '/',
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Fundamentos',
    items: [
      {
        id: 'angular-basics',
        label: 'Fundamentos de Angular',
        description: 'Conceptos base del framework',
        status: 'available',
        path: '/fundamentals',
      },
      {
        id: 'components',
        label: 'Componentes',
        description: 'Plantillas, entradas, salidas y composición',
        status: 'available',
        path: '/components',
      },
    ],
  },
  {
    id: 'reactivity',
    label: 'Reactividad y datos',
    items: [
      {
        id: 'signals',
        label: 'Signals y reactividad',
        description: 'Estado reactivo con signals',
        status: 'available',
        path: '/signals',
      },
      {
        id: 'rxjs',
        label: 'RxJS',
        description: 'Flujos asíncronos con observables',
        status: 'available',
        path: '/rxjs',
      },
      {
        id: 'http',
        label: 'HTTP y recursos',
        description: 'Acceso a datos remotos',
        status: 'available',
        path: '/http',
      },
    ],
  },
  {
    id: 'application',
    label: 'Arquitectura de la aplicación',
    items: [
      {
        id: 'routing',
        label: 'Routing y Lazy Loading',
        description: 'Navegación y carga diferida',
        status: 'available',
        path: '/routing',
      },
      {
        id: 'forms',
        label: 'Formularios y Signal Forms',
        description: 'Captura y validación de datos',
        status: 'available',
        path: '/forms',
      },
      {
        id: 'dependency-injection',
        label: 'Dependency Injection',
        description: 'Servicios e inyección de dependencias',
        status: 'available',
        path: '/dependency-injection',
      },
    ],
  },
  {
    id: 'quality',
    label: 'Calidad y evolución',
    items: [
      {
        id: 'testing',
        label: 'Testing',
        description: 'Pruebas unitarias y de componentes',
        status: 'available',
        path: '/testing',
      },
      {
        id: 'performance',
        label: 'Rendimiento y optimización',
        description: 'Aplicaciones rápidas y eficientes',
        status: 'available',
        path: '/performance',
      },
      {
        id: 'whats-new',
        label: 'Novedades de Angular',
        description: 'Cambios relevantes de cada versión',
        status: 'available',
        path: '/whats-new',
      },
    ],
  },
];

export const NAV_ITEMS: readonly NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

const HOME_ITEM_ID = 'home';

// Study topics shown as cards on the home page: every nav item except Home itself.
export const TOPICS: readonly NavItem[] = NAV_ITEMS.filter((item) => item.id !== HOME_ITEM_ID);

export function findGroupIdByPath(path: string): string | undefined {
  return NAV_GROUPS.find((group) =>
    group.items.some(
      (item) =>
        item.status === 'available' &&
        (item.path === path || (item.path !== '/' && path.startsWith(`${item.path}/`))),
    ),
  )?.id;
}
