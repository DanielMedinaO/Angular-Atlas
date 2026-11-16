export const BOOK_CATEGORIES = [
  'Angular',
  'TypeScript',
  'Reactividad',
  'Arquitectura',
  'Rendimiento',
  'Pruebas',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export const ALL_CATEGORIES = 'Todas';

export type CategoryFilter = typeof ALL_CATEGORIES | BookCategory;

export const CATEGORY_FILTERS: readonly CategoryFilter[] = [ALL_CATEGORIES, ...BOOK_CATEGORIES];

export interface Book {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly category: BookCategory;
  readonly description: string;
}

export function isCategoryFilter(value: unknown): value is CategoryFilter {
  return typeof value === 'string' && (CATEGORY_FILTERS as readonly string[]).includes(value);
}

export const BOOK_CATALOG: readonly Book[] = [
  {
    id: 1,
    title: 'Pro Angular',
    author: 'Adam Freeman',
    category: 'Angular',
    description:
      'Recorrido práctico por componentes, enrutamiento, formularios y pruebas para construir aplicaciones Angular completas.',
  },
  {
    id: 2,
    title: 'Angular Development with TypeScript',
    author: 'Yakov Fain y Anton Moiseev',
    category: 'Angular',
    description:
      'Explica la arquitectura de Angular de punta a punta y cómo aprovechar TypeScript en cada capa de la aplicación.',
  },
  {
    id: 3,
    title: 'Effective TypeScript',
    author: 'Dan Vanderkam',
    category: 'TypeScript',
    description:
      'Sesenta y dos hábitos concretos para usar el sistema de tipos de forma segura, expresiva y mantenible.',
  },
  {
    id: 4,
    title: 'Programming TypeScript',
    author: 'Boris Cherny',
    category: 'TypeScript',
    description:
      'Introducción rigurosa al lenguaje: tipos avanzados, genéricos, manejo de errores y herramientas de compilación.',
  },
  {
    id: 5,
    title: 'Reactive Programming with RxJS',
    author: 'Sergi Mansilla',
    category: 'Reactividad',
    description:
      'Modela eventos asíncronos como flujos observables y compón operadores para describir lógica compleja.',
  },
  {
    id: 6,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Arquitectura',
    description:
      'Principios para escribir código legible: nombres expresivos, funciones pequeñas y una gestión de errores clara.',
  },
  {
    id: 7,
    title: 'Design Patterns',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides',
    category: 'Arquitectura',
    description:
      'Catálogo clásico de patrones de diseño orientados a objetos con su motivación, estructura y consecuencias.',
  },
  {
    id: 8,
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Arquitectura',
    description:
      'Técnicas para mejorar el diseño del código existente en pasos pequeños y seguros, respaldados por pruebas.',
  },
  {
    id: 9,
    title: 'High Performance Browser Networking',
    author: 'Ilya Grigorik',
    category: 'Rendimiento',
    description:
      'Cómo funcionan TCP, TLS, HTTP/2 y las redes móviles, y qué implican para la velocidad de una aplicación web.',
  },
  {
    id: 10,
    title: 'Web Performance in Action',
    author: 'Jeremy Wagner',
    category: 'Rendimiento',
    description:
      'Optimización de recursos, carga diferida y caché para reducir los tiempos de carga de sitios y aplicaciones.',
  },
  {
    id: 11,
    title: 'Test-Driven Development: By Example',
    author: 'Kent Beck',
    category: 'Pruebas',
    description:
      'Introduce el ciclo rojo-verde-refactor a través de ejemplos guiados que muestran el diseño emergente desde las pruebas.',
  },
  {
    id: 12,
    title: 'Unit Testing Principles, Practices, and Patterns',
    author: 'Vladimir Khorikov',
    category: 'Pruebas',
    description:
      'Criterios para escribir pruebas unitarias valiosas y evitar las frágiles, con énfasis en el comportamiento observable.',
  },
];
