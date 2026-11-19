import { OpenLibraryBook, OpenLibrarySearchResponse } from './open-library.model';

const DEMO_BOOKS: readonly OpenLibraryBook[] = [
  {
    key: '/works/DEMO-ANGULAR-001',
    title: 'Manual ficticio de Angular y Signals',
    authorNames: ['Equipo de demostración Angular Atlas'],
    firstPublishYear: 2026,
    coverId: null,
  },
  {
    key: '/works/DEMO-RXJS-002',
    title: 'RxJS cotidiano: ejercicios imaginarios',
    authorNames: ['Biblioteca de ejemplos locales'],
    firstPublishYear: null,
    coverId: null,
  },
  {
    key: '/works/DEMO-HTTP-003',
    title: 'HTTP en una biblioteca de prueba',
    authorNames: [],
    firstPublishYear: 2025,
    coverId: null,
  },
];

export function searchDemoBooks(query: string): OpenLibrarySearchResponse {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const docs = DEMO_BOOKS.filter((book) =>
    `${book.title} ${book.authorNames.join(' ')}`.toLocaleLowerCase().includes(normalizedQuery),
  ).slice(0, 10);

  return { numFound: docs.length, docs };
}
