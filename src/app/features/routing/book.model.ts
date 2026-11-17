export const BOOK_CATEGORIES = ['Angular', 'TypeScript', 'JavaScript', 'Arquitectura'] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly category: BookCategory;
  readonly description: string;
}

export const BOOKS: readonly Book[] = [
  {
    id: 'angular-in-depth',
    title: 'Angular en profundidad',
    author: 'M. Gechev',
    category: 'Angular',
    description: 'Una guía práctica para construir aplicaciones Angular modernas.',
  },
  {
    id: 'angular-cookbook',
    title: 'Angular Cookbook',
    author: 'M. K. Sharma',
    category: 'Angular',
    description: 'Patrones y soluciones para problemas cotidianos de Angular.',
  },
  {
    id: 'effective-typescript',
    title: 'Effective TypeScript',
    author: 'Dan Vanderkam',
    category: 'TypeScript',
    description: 'Consejos para escribir TypeScript seguro y expresivo.',
  },
  {
    id: 'javascript-definitive-guide',
    title: 'JavaScript: The Definitive Guide',
    author: 'David Flanagan',
    category: 'JavaScript',
    description: 'Referencia completa del lenguaje JavaScript.',
  },
  {
    id: 'designing-data-intensive-applications',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Arquitectura',
    description: 'Fundamentos para diseñar sistemas de datos confiables y escalables.',
  },
];

export function isBookCategory(value: string | null): value is BookCategory {
  return BOOK_CATEGORIES.some((category) => category === value);
}
