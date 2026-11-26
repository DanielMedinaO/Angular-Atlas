import { Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

type Category = 'ficcion' | 'tecnica';
type ReadingStatus = 'pending' | 'reading' | 'finished';

interface Book {
  readonly id: number;
  readonly title: string;
  readonly category: Category;
  readonly status: ReadingStatus;
}

const CATEGORIES: Record<Category, string> = { ficcion: 'Ficción', tecnica: 'Técnica' };
const NEXT_STATUS: Record<ReadingStatus, ReadingStatus> = {
  pending: 'reading',
  reading: 'finished',
  finished: 'pending',
};

@Component({
  selector: 'app-control-flow-lab',
  imports: [FormField],
  templateUrl: './control-flow-lab.html',
  styleUrl: '../shared/fundamentals-lab.scss',
})
export class ControlFlowLab {
  protected readonly categories = CATEGORIES;
  protected readonly filter = signal<Category | 'all'>('all');
  protected readonly showDetails = signal(true);
  protected readonly draft = signal({ title: '' });
  protected readonly draftForm = form(this.draft);
  protected readonly draftHasTitle = computed(() => this.draft().title.trim().length > 0);
  private readonly books = signal<readonly Book[]>([
    { id: 1, title: 'El principito', category: 'ficcion', status: 'pending' },
    { id: 2, title: 'Angular en práctica', category: 'tecnica', status: 'reading' },
  ]);
  private nextId = 3;

  protected readonly visibleBooks = computed(() => {
    const category = this.filter();
    const books = this.books();
    return category === 'all' ? books : books.filter((book) => book.category === category);
  });

  protected readonly statusMessage = signal('');

  protected setFilter(value: string): void {
    if (value === 'all' || value === 'ficcion' || value === 'tecnica') {
      this.filter.set(value);
    }
  }

  protected addBook(event: SubmitEvent, focusTarget: HTMLInputElement): void {
    event.preventDefault();
    const title = this.draft().title.trim();
    if (!title) return;

    const filter = this.filter();
    const category = filter === 'all' ? 'ficcion' : filter;
    const book: Book = { id: this.nextId++, title, category, status: 'pending' };
    this.books.update((books) => [...books, book]);
    this.draft.set({ title: '' });
    this.statusMessage.set(`Se agregó «${title}».`);
    focusTarget.focus();
  }

  protected changeStatus(id: number): void {
    this.books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, status: NEXT_STATUS[book.status] } : book)),
    );
  }

  protected removeBook(book: Book, focusTarget: HTMLInputElement): void {
    this.books.update((books) => books.filter(({ id }) => id !== book.id));
    this.statusMessage.set(`Se eliminó «${book.title}».`);
    focusTarget.focus();
  }
}
