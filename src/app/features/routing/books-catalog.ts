import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BOOKS, BOOK_CATEGORIES, BookCategory, isBookCategory } from './book.model';

@Component({
  selector: 'app-books-catalog',
  imports: [RouterLink],
  template: `
    <section class="books" aria-labelledby="books-title">
      <h3 id="books-title">Catálogo técnico</h3>
      <label for="book-category">Filtrar por categoría</label>
      <select
        id="book-category"
        (change)="changeCategory($event)"
      >
        <option value="" [selected]="!category()">Todas las categorías</option>
        @for (optionCategory of categories; track optionCategory) {
          <option [value]="optionCategory" [selected]="category() === optionCategory">
            {{ optionCategory }}
          </option>
        }
      </select>

      <ul class="books__list">
        @for (book of filteredBooks(); track book.id) {
          <li>
            <a [routerLink]="['/routing/books', book.id]">{{ book.title }}</a>
            <span>{{ book.category }} · {{ book.author }}</span>
          </li>
        } @empty {
          <li>No hay libros en esta categoría.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .books { display: grid; gap: 0.75rem; }
    .books h3 { font-size: 1.05rem; }
    .books label { color: var(--atlas-text-muted); font-size: 0.9rem; font-weight: 600; }
    .books select {
      justify-self: start;
      width: min(100%, 20rem);
      border: 1px solid var(--atlas-border);
      border-radius: var(--atlas-radius-md);
      background: var(--atlas-surface);
      color: var(--atlas-text);
      padding: 0.7rem 0.85rem;
      font: inherit;
      cursor: pointer;
      box-shadow: var(--atlas-shadow-sm);
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    .books select:hover { border-color: var(--atlas-accent-strong); }
    .books select:focus-visible {
      border-color: var(--atlas-accent-strong);
      outline: 3px solid var(--atlas-accent-soft);
      outline-offset: 2px;
    }
    .books__list { display: grid; gap: 0.6rem; padding-left: 1.25rem; }
    .books__list li { display: grid; gap: 0.15rem; }
    .books__list a { color: var(--atlas-accent-strong); font-weight: 600; }
    .books__list span { color: var(--atlas-text-muted); font-size: 0.9rem; }
  `,
})
export class BooksCatalog {
  protected readonly categories = BOOK_CATEGORIES;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryCategory = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('category'))),
    { initialValue: this.route.snapshot.queryParamMap.get('category') },
  );
  protected readonly category = computed(() => {
    const value = this.queryCategory();
    return isBookCategory(value) ? value : '';
  });
  protected readonly filteredBooks = computed(() => {
    const category = this.category();
    return category ? BOOKS.filter((book) => book.category === category) : BOOKS;
  });

  protected changeCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const category: BookCategory | '' = isBookCategory(value) ? value : '';

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category || null },
      queryParamsHandling: 'merge',
    });
  }
}
