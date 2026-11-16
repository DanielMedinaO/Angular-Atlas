import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import {
  ALL_CATEGORIES,
  BOOK_CATALOG,
  Book,
  CATEGORY_FILTERS,
  CategoryFilter,
  isCategoryFilter,
} from './book-catalog';

export const CATEGORY_STORAGE_KEY = 'atlas.book-explorer.category';

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

@Component({
  selector: 'app-book-explorer',
  styleUrl: './book-explorer.scss',
  templateUrl: './book-explorer.html',
})
export class BookExplorer {
  private readonly document = inject(DOCUMENT);

  protected readonly categories = CATEGORY_FILTERS;

  // Estado fuente de verdad: lo único que escribe el usuario.
  protected readonly searchTerm = signal('');
  protected readonly category = signal<CategoryFilter>(this.readStoredCategory());

  // Estado derivado de solo lectura.
  protected readonly filteredBooks = computed<readonly Book[]>(() => {
    const term = normalize(this.searchTerm());
    const category = this.category();

    return BOOK_CATALOG.filter(
      (book) =>
        (category === ALL_CATEGORIES || book.category === category) &&
        (term === '' || normalize(`${book.title} ${book.author} ${book.description}`).includes(term)),
    );
  });

  protected readonly resultCount = computed(() => this.filteredBooks().length);
  protected readonly resultLabel = computed(() =>
    this.resultCount() === 1 ? '1 resultado' : `${this.resultCount()} resultados`,
  );

  // Derivado, pero escribible: se recalcula cuando cambian los resultados
  // y también acepta set() para la selección manual.
  protected readonly selectedBook = linkedSignal<readonly Book[], Book | null>({
    source: this.filteredBooks,
    computation: (books, previous) =>
      books.find((book) => book.id === previous?.value?.id) ?? books[0] ?? null,
  });

  constructor() {
    // Efecto secundario hacia el exterior (localStorage); no copia estado entre signals.
    effect(() => this.writeStoredCategory(this.category()));
  }

  protected onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.category.set(isCategoryFilter(value) ? value : ALL_CATEGORIES);
  }

  protected select(book: Book): void {
    this.selectedBook.set(book);
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.category.set(ALL_CATEGORIES);
  }

  private getStorage(): Storage | null {
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private readStoredCategory(): CategoryFilter {
    try {
      const stored = this.getStorage()?.getItem(CATEGORY_STORAGE_KEY);
      return isCategoryFilter(stored) ? stored : ALL_CATEGORIES;
    } catch {
      return ALL_CATEGORIES;
    }
  }

  private writeStoredCategory(category: CategoryFilter): void {
    try {
      this.getStorage()?.setItem(CATEGORY_STORAGE_KEY, category);
    } catch {
      // Almacenamiento bloqueado o lleno: la preferencia simplemente no persiste.
    }
  }
}
