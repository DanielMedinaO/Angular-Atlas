import { Component, computed, signal } from '@angular/core';
import { BookCardComponent } from './book-card/book-card';
import { Book, EXAMPLE_BOOK } from './book.model';
import { FavoriteToggleComponent } from './favorite-toggle/favorite-toggle';

type AddFeedback = 'idle' | 'added' | 'duplicate';

@Component({
  selector: 'app-component-communication',
  imports: [BookCardComponent, FavoriteToggleComponent],
  templateUrl: './component-communication.html',
  styleUrl: './component-communication.scss',
})
export class ComponentCommunicationComponent {
  // El padre es dueño del estado; los hijos solo reciben datos y emiten cambios.
  protected readonly book = signal<Book>(EXAMPLE_BOOK);
  protected readonly readingList = signal<string[]>([]);
  protected readonly isFavorite = signal(false);
  private readonly feedback = signal<AddFeedback>('idle');

  protected readonly statusMessage = computed(() => {
    switch (this.feedback()) {
      case 'added':
        return 'Libro añadido a la lista de lectura.';
      case 'duplicate':
        return 'Ese libro ya estaba en la lista; no se añadió de nuevo.';
      default:
        return '';
    }
  });

  protected addToReadingList(bookId: string): void {
    if (this.readingList().includes(bookId)) {
      this.feedback.set('duplicate');
      return;
    }

    this.readingList.update((list) => [...list, bookId]);
    this.feedback.set('added');
  }

  protected clearReadingList(): void {
    this.readingList.set([]);
    this.feedback.set('idle');
  }
}
