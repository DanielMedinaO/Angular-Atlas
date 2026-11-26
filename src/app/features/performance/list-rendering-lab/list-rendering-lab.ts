import {
  afterEveryRender,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Book, BookItemComponent, BookLifecycle } from './book-item/book-item';

@Component({
  selector: 'app-list-rendering-lab',
  imports: [BookItemComponent],
  providers: [BookLifecycle],
  template: `
    <div class="catalog-toolbar">
      <div class="filter">
        <label for="performance-book-filter">Filtrar por título</label>
        <input
          #filter
          id="performance-book-filter"
          type="search"
          placeholder="Ej. Angular"
          [value]="query()"
          (input)="query.set(filter.value)"
        />
      </div>
      <div class="actions">
        <button #add class="primary" type="button" (click)="addBook()">Agregar libro</button>
        <button type="button" [attr.aria-disabled]="visibleBooks().length < 2" (click)="reverse()">
          Invertir orden
        </button>
      </div>
    </div>
    <p class="catalog-status" role="status">
      {{ visibleBooks().length }} títulos visibles de {{ books().length }}
    </p>
    <div class="columns">
      <div class="panel">
        <header class="list-header">
          <h3 id="performance-track-id">Identidad por libro <code>track book.id</code></h3>
          <p #idMetric class="instance-count"></p>
        </header>
        <ul class="books" aria-labelledby="performance-track-id" role="list">
          @for (book of visibleBooks(); track book.id) {
            <li>
              <app-performance-book-item
                [book]="book"
                tracking="id"
                (remove)="removeBook($event); add.focus()"
              />
            </li>
          } @empty {
            <li class="empty">Sin títulos visibles</li>
          }
        </ul>
      </div>
      <div class="panel">
        <header class="list-header">
          <h3 id="performance-track-index">Identidad por posición <code>track $index</code></h3>
          <p #indexMetric class="instance-count"></p>
        </header>
        <ul class="books" aria-labelledby="performance-track-index" role="list">
          @for (book of visibleBooks(); track $index) {
            <li>
              <app-performance-book-item
                [book]="book"
                tracking="index"
                (remove)="removeBook($event); add.focus()"
              />
            </li>
          } @empty {
            <li class="empty">Sin títulos visibles</li>
          }
        </ul>
      </div>
    </div>
  `,
  styleUrls: [
    '../shared/lab-columns.scss',
    '../shared/lab-controls.scss',
    './list-rendering-lab.scss',
  ],
})
export class ListRenderingLab {
  protected readonly books = signal<readonly Book[]>([
    { id: 1, title: 'Angular en acción' },
    { id: 2, title: 'TypeScript práctico' },
    { id: 3, title: 'Diseño web accesible' },
  ]);
  protected readonly query = signal('');
  protected readonly visibleBooks = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('es');
    return this.books().filter((book) => book.title.toLocaleLowerCase('es').includes(query));
  });
  private nextBookId = 4;
  private readonly lifecycle = inject(BookLifecycle);
  private readonly idMetric = viewChild.required<ElementRef<HTMLElement>>('idMetric');
  private readonly indexMetric = viewChild.required<ElementRef<HTMLElement>>('indexMetric');

  constructor() {
    afterEveryRender(() => {
      const { id, index } = this.lifecycle.counts;
      this.displayCounts(this.idMetric(), id);
      this.displayCounts(this.indexMetric(), index);
    });
  }

  protected addBook(): void {
    const id = this.nextBookId++;
    this.books.update((books) => [...books, { id, title: `Cuaderno de lectura ${id}` }]);
    this.query.set('');
  }

  protected reverse(): void {
    if (this.visibleBooks().length >= 2) {
      this.books.update((books) => [...books].reverse());
    }
  }

  protected removeBook(id: number): void {
    this.books.update((books) => books.filter((book) => book.id !== id));
  }

  private displayCounts(
    element: ElementRef<HTMLElement>,
    counts: { created: number; destroyed: number },
  ): void {
    const value = `Creadas: ${counts.created} · Destruidas: ${counts.destroyed}`;
    if (element.nativeElement.textContent !== value) {
      element.nativeElement.textContent = value;
    }
  }
}
