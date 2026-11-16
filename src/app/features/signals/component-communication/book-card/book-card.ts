import { Component, input, output } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCardComponent {
  // Dato de solo lectura que fluye padre → hijo; obligatorio en cada uso.
  readonly book = input.required<Book>();

  // Evento hijo → padre: el hijo solo informa, no conoce la lista de lectura.
  readonly addRequested = output<string>();

  protected requestAdd(): void {
    this.addRequested.emit(this.book().id);
  }
}
