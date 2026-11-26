export const releaseStatuses = {
  stable: 'Estable',
  'developer-preview': 'Vista previa para desarrolladores',
  experimental: 'Experimental',
  deprecated: 'Obsoleta',
} as const;

export const verifiedAt = '2026-11-26';

interface ReleaseFeature {
  id: string;
  name: string;
  introducedIn: string;
  status: keyof typeof releaseStatuses;
  category: string;
  description: string;
  docsUrl: string;
  atlasPath?: string;
  atlasFragment?: string;
}

export const releaseCatalog: readonly ReleaseFeature[] = [
  {
    id: 'arrow',
    name: 'Funciones flecha en templates',
    introducedIn: '21.2',
    status: 'stable',
    category: 'Templates',
    description: 'Permiten declarar callbacks breves dentro de expresiones.',
    docsUrl: 'https://angular.dev/guide/templates/expression-syntax',
    atlasFragment: 'templates',
  },
  {
    id: 'spread',
    name: 'Spread y rest en templates',
    introducedIn: '21.1',
    status: 'stable',
    category: 'Templates',
    description: 'Expande elementos en arrays, propiedades en objetos y argumentos en llamadas.',
    docsUrl: 'https://angular.dev/guide/templates/expression-syntax',
    atlasFragment: 'templates',
  },
  {
    id: 'grouped-case',
    name: 'Casos agrupados en @switch',
    introducedIn: '21.1',
    status: 'stable',
    category: 'Templates',
    description: 'Varios valores pueden compartir el mismo bloque.',
    docsUrl: 'https://angular.dev/guide/templates/control-flow',
    atlasFragment: 'templates',
  },
  {
    id: 'exhaustive',
    name: 'Exhaustividad con @default never',
    introducedIn: '21.2',
    status: 'stable',
    category: 'Templates',
    description: 'El compilador comprueba que cada valor de una unión tenga un caso.',
    docsUrl: 'https://angular.dev/guide/templates/control-flow',
    atlasFragment: 'templates',
  },
  {
    id: 'comments',
    name: 'Comentarios dentro de la etiqueta de apertura',
    introducedIn: '22.0',
    status: 'stable',
    category: 'Templates',
    description: 'Anota atributos y bindings directamente en la etiqueta de apertura.',
    docsUrl: 'https://github.com/angular/angular/blob/main/CHANGELOG.md#2200-2026-06-03',
    atlasFragment: 'templates',
  },
  {
    id: 'aria',
    name: 'Angular Aria',
    introducedIn: '21.0',
    status: 'stable',
    category: 'Accesibilidad',
    description: 'Primitivas de interacción accesibles con estilos propios. Estable desde v22.',
    docsUrl: 'https://angular.dev/guide/aria/overview',
    atlasFragment: 'aria',
  },
  {
    id: 'signal-forms',
    name: 'Signal Forms',
    introducedIn: '21.0',
    status: 'stable',
    category: 'Formularios',
    description: 'Campos reactivos y validación con signals. Estable desde v22.',
    docsUrl: 'https://angular.dev/guide/forms/signals/overview',
    atlasPath: '/forms',
  },
  {
    id: 'router-resources',
    name: 'Recursos del Router',
    introducedIn: '22.2',
    status: 'developer-preview',
    category: 'Router',
    description: 'Habilita la carga reactiva de recursos declarados en rutas.',
    docsUrl: 'https://angular.dev/api/router/withRouterResources',
  },
  {
    id: 'navigation',
    name: 'Platform Navigation API',
    introducedIn: '21.1',
    status: 'experimental',
    category: 'Router',
    description:
      'Integra el Router con la navegación nativa del navegador. Su soporte en navegadores es limitado.',
    docsUrl: 'https://angular.dev/api/router/withExperimentalPlatformNavigation',
  },
  {
    id: 'webmcp',
    name: 'WebMCP',
    introducedIn: '22.0',
    status: 'experimental',
    category: 'Herramientas para agentes',
    description:
      'Expone herramientas de la aplicación a agentes del navegador. La propuesta y las APIs pueden cambiar.',
    docsUrl: 'https://angular.dev/ai/webmcp',
  },
  {
    id: 'ng-if',
    name: 'NgIf',
    introducedIn: '2.0',
    status: 'deprecated',
    category: 'Templates',
    description: 'Obsoleta desde v20. Angular recomienda el bloque @if.',
    docsUrl: 'https://angular.dev/api/common/NgIf',
  },
];
