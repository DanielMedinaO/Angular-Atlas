import { Injectable, signal } from '@angular/core';
import { BookCreationDto, RegisteredBook } from './book.model';

export class DuplicateIsbnError extends Error {
  constructor() {
    super('Ya existe un libro registrado con ese ISBN.');
    this.name = 'DuplicateIsbnError';
  }
}

@Injectable()
export class BookRepository {
  readonly books = signal<readonly RegisteredBook[]>([]);

  private nextId = 1;
  private readonly existingIsbns = new Set(['9780132350884']);

  async isDuplicateIsbn(isbn: string, abortSignal?: AbortSignal): Promise<boolean> {
    await this.waitForLocalCheck(abortSignal);
    const normalizedIsbn = isbn.replaceAll(/[-\s]/g, '').toUpperCase();

    return (
      this.existingIsbns.has(normalizedIsbn) ||
      this.books().some(
        (book) => book.isbn?.replaceAll(/[-\s]/g, '').toUpperCase() === normalizedIsbn,
      )
    );
  }

  async save(dto: BookCreationDto): Promise<RegisteredBook> {
    if (dto.isbn && (await this.isDuplicateIsbn(dto.isbn))) {
      throw new DuplicateIsbnError();
    }

    const book: RegisteredBook = {
      ...dto,
      id: this.nextId++,
      registeredAt: new Date().toISOString(),
    };
    this.books.update((books) => [...books, book]);
    return book;
  }

  private waitForLocalCheck(abortSignal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const finish = (): void => {
        abortSignal?.removeEventListener('abort', abort);
        resolve();
      };
      const abort = (): void => {
        clearTimeout(timeout);
        abortSignal?.removeEventListener('abort', abort);
        reject(new DOMException('La validación quedó obsoleta.', 'AbortError'));
      };
      const timeout = setTimeout(finish, 100);

      if (abortSignal?.aborted) {
        abort();
      } else {
        abortSignal?.addEventListener('abort', abort, { once: true });
      }
    });
  }
}
