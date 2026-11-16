export interface Book {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
}

export const EXAMPLE_BOOK: Book = {
  id: 'effective-typescript',
  title: 'Effective TypeScript',
  author: 'Dan Vanderkam',
  description:
    'Sesenta y dos hábitos concretos para usar el sistema de tipos de forma segura, expresiva y mantenible.',
};
