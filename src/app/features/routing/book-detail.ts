import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './book.model';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  template: `
    <article class="book-detail">
      <a routerLink="/routing/books">← Volver al catálogo</a>
      <p class="book-detail__category">{{ book().category }} · {{ book().author }}</p>
      <h3>{{ book().title }}</h3>
      <p>{{ book().description }}</p>
      <code>ID de ruta: {{ book().id }}</code>
    </article>
  `,
  styles: `
    .book-detail { display: grid; gap: 0.65rem; }
    .book-detail a { color: var(--atlas-accent-strong); }
    .book-detail__category { color: var(--atlas-text-muted); font-size: 0.9rem; }
    .book-detail code { justify-self: start; }
  `,
})
export class BookDetail {
  readonly book = input.required<Book>();
}
