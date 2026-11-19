export const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
export const OPEN_LIBRARY_SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'cover_i',
] as const;
export const OPEN_LIBRARY_RESULT_LIMIT = 10;

export interface OpenLibraryBook {
  readonly key: string;
  readonly title: string;
  readonly authorNames: readonly string[];
  readonly firstPublishYear: number | null;
  readonly coverId: number | null;
}

export interface OpenLibrarySearchResponse {
  readonly numFound: number;
  readonly docs: readonly OpenLibraryBook[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) ? value : null;
}

export function normalizeOpenLibraryResponse(value: unknown): OpenLibrarySearchResponse {
  if (!isRecord(value) || !Array.isArray(value['docs'])) {
    throw new TypeError('La respuesta de Open Library no tiene el formato esperado.');
  }

  const numFound = value['numFound'];
  if (typeof numFound !== 'number' || !Number.isFinite(numFound) || numFound < 0) {
    throw new TypeError('La respuesta de Open Library no contiene un total válido.');
  }

  const docs = value['docs'].map((doc: unknown): OpenLibraryBook => {
    if (!isRecord(doc) || typeof doc['key'] !== 'string' || typeof doc['title'] !== 'string') {
      throw new TypeError('Un libro de la respuesta no contiene su clave o título.');
    }

    return {
      key: doc['key'],
      title: doc['title'],
      authorNames: Array.isArray(doc['author_name'])
        ? doc['author_name'].filter((author): author is string => typeof author === 'string')
        : [],
      firstPublishYear: optionalInteger(doc['first_publish_year']),
      coverId: optionalInteger(doc['cover_i']),
    };
  });

  return { numFound, docs };
}
