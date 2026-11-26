import {
  Component,
  inject,
  Injectable,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

export interface Book {
  readonly id: number;
  readonly title: string;
}

export type Tracking = 'id' | 'index';

@Injectable()
export class BookLifecycle {
  private nextInstance = 1;
  readonly counts = {
    id: { created: 0, destroyed: 0 },
    index: { created: 0, destroyed: 0 },
  };

  create(tracking: Tracking): number {
    this.counts[tracking].created++;
    return this.nextInstance++;
  }

  destroy(tracking: Tracking): void {
    this.counts[tracking].destroyed++;
  }
}

@Component({
  selector: 'app-performance-book-item',
  host: { '[class.is-marked]': 'marked()' },
  styleUrls: ['../../shared/lab-controls.scss', './book-item.scss'],
  template: `
    <p class="book-title">{{ book().title }}</p>
    <p class="book-identity">
      <span>ID {{ book().id }}</span>
      <span>Instancia {{ instance }}</span>
    </p>
    <div class="actions">
      <button
        type="button"
        [attr.aria-label]="'Marcar ' + book().title"
        [attr.aria-pressed]="marked()"
        (click)="marked.update((value) => !value)"
      >
        Marcar
      </button>
      <button
        type="button"
        [attr.aria-label]="'Eliminar ' + book().title"
        (click)="remove.emit(book().id)"
      >
        Eliminar
      </button>
      @if (marked()) {
        <span class="marked-label" aria-hidden="true">Marcado</span>
      }
    </div>
  `,
})
export class BookItemComponent implements OnInit, OnDestroy {
  readonly book = input.required<Book>();
  readonly tracking = input.required<Tracking>();
  readonly remove = output<number>();

  protected readonly marked = signal(false);
  protected instance = 0;
  private readonly lifecycle = inject(BookLifecycle);

  ngOnInit(): void {
    this.instance = this.lifecycle.create(this.tracking());
  }

  ngOnDestroy(): void {
    this.lifecycle.destroy(this.tracking());
  }
}
