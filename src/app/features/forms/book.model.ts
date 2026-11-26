export type BookCategory = 'architecture' | 'angular' | 'typescript' | 'other';

export interface BookFormModel {
  title: string;
  author: string;
  category: BookCategory;
  year: number | null;
  description: string;
  isbn: string;
  additionalAuthors: string[];
}

export interface BookCreationDto {
  title: string;
  authors: readonly string[];
  category: BookCategory;
  year: number;
  description?: string;
  isbn?: string;
}

export interface RegisteredBook extends BookCreationDto {
  id: number;
  registeredAt: string;
}

export function createBookFormModel(year: number): BookFormModel {
  return {
    title: '',
    author: '',
    category: 'architecture',
    year,
    description: '',
    isbn: '',
    additionalAuthors: [],
  };
}

export function toBookCreationDto(model: BookFormModel): BookCreationDto {
  if (typeof model.year !== 'number' || !Number.isFinite(model.year)) {
    throw new TypeError('El año debe ser un número válido para crear un libro.');
  }

  const authors = [model.author, ...model.additionalAuthors]
    .map((author) => author.trim())
    .filter(Boolean);

  return {
    title: model.title.trim(),
    authors,
    category: model.category,
    year: model.year,
    ...(model.description.trim() ? { description: model.description.trim() } : {}),
    ...(model.isbn.trim() ? { isbn: model.isbn.trim() } : {}),
  };
}
