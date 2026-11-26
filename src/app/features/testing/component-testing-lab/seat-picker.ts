import { Component, computed, signal } from '@angular/core';

export const MAX_SEATS = 4;
export const SEAT_PRICE = 15;

@Component({
  selector: 'app-seat-picker',
  styleUrl: './seat-picker.scss',
  template: `
    <section class="seats" aria-labelledby="seats-title">
      <h3 id="seats-title">Selector de asientos</h3>
      <p class="seats__hint">
        Componente de práctica: máximo {{ maxSeats }} asientos a {{ seatPrice }} USD cada uno.
      </p>

      <dl class="seats__stats">
        <div>
          <dt>Asientos</dt>
          <dd data-testid="seat-count">{{ seats() }}</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd data-testid="seat-remaining">{{ remaining() }}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd data-testid="seat-total">{{ total() }} USD</dd>
        </div>
      </dl>

      <div class="seats__actions">
        <button type="button" data-testid="add-seat" [disabled]="isFull()" (click)="add()">
          Agregar asiento
        </button>
        <button type="button" data-testid="remove-seat" [disabled]="isEmpty()" (click)="remove()">
          Quitar asiento
        </button>
        <button type="button" data-testid="reset-seats" [disabled]="isEmpty()" (click)="reset()">
          Reiniciar
        </button>
      </div>

      <p class="seats__message" role="status" data-testid="seat-message">{{ message() }}</p>
    </section>
  `,
})
export class SeatPicker {
  protected readonly maxSeats = MAX_SEATS;
  protected readonly seatPrice = SEAT_PRICE;

  protected readonly seats = signal(0);
  protected readonly total = computed(() => this.seats() * SEAT_PRICE);
  protected readonly remaining = computed(() => MAX_SEATS - this.seats());
  protected readonly isEmpty = computed(() => this.seats() === 0);
  protected readonly isFull = computed(() => this.seats() === MAX_SEATS);
  protected readonly message = computed(() => {
    if (this.isFull()) {
      return 'Límite alcanzado: no puedes reservar más asientos.';
    }
    if (this.isEmpty()) {
      return 'Aún no has seleccionado asientos.';
    }
    return this.seats() === 1
      ? 'Tienes 1 asiento seleccionado.'
      : `Tienes ${this.seats()} asientos seleccionados.`;
  });

  protected add(): void {
    this.seats.update((count) => Math.min(count + 1, MAX_SEATS));
  }

  protected remove(): void {
    this.seats.update((count) => Math.max(count - 1, 0));
  }

  protected reset(): void {
    this.seats.set(0);
  }
}
