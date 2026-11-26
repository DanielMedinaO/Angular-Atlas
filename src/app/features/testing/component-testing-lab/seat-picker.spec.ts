import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAX_SEATS, SEAT_PRICE, SeatPicker } from './seat-picker';

describe('SeatPicker', () => {
  let fixture: ComponentFixture<SeatPicker>;
  let host: HTMLElement;

  const byTestId = (id: string): HTMLButtonElement =>
    host.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!;
  const text = (id: string): string => byTestId(id).textContent?.trim() ?? '';
  const click = async (id: string, times = 1): Promise<void> => {
    for (let index = 0; index < times; index++) {
      byTestId(id).click();
      await fixture.whenStable();
    }
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(SeatPicker);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  describe('initial render', () => {
    it('shows zero seats, the full capacity and a zero total', () => {
      expect(text('seat-count')).toBe('0');
      expect(text('seat-remaining')).toBe(String(MAX_SEATS));
      expect(text('seat-total')).toBe('0 USD');
    });

    it('shows the empty-state message and disables the actions that need a seat', () => {
      expect(text('seat-message')).toBe('Aún no has seleccionado asientos.');
      expect(byTestId('add-seat').disabled).toBe(false);
      expect(byTestId('remove-seat').disabled).toBe(true);
      expect(byTestId('reset-seats').disabled).toBe(true);
    });
  });

  describe('user interactions', () => {
    it('adds a seat and updates the signal-driven view', async () => {
      await click('add-seat');

      expect(text('seat-count')).toBe('1');
      expect(text('seat-remaining')).toBe(String(MAX_SEATS - 1));
    });

    it('removes a seat after adding two', async () => {
      await click('add-seat', 2);
      await click('remove-seat');

      expect(text('seat-count')).toBe('1');
    });

    it('resets the selection back to the initial state', async () => {
      await click('add-seat', 3);
      await click('reset-seats');

      expect(text('seat-count')).toBe('0');
      expect(text('seat-message')).toBe('Aún no has seleccionado asientos.');
      expect(byTestId('reset-seats').disabled).toBe(true);
    });
  });

  describe('derived state', () => {
    it('recomputes the total from the seat count', async () => {
      await click('add-seat', 3);

      expect(text('seat-total')).toBe(`${3 * SEAT_PRICE} USD`);
    });

    it('recomputes the remaining capacity after removing seats', async () => {
      await click('add-seat', 3);
      await click('remove-seat');

      expect(text('seat-remaining')).toBe('2');
      expect(text('seat-total')).toBe(`${2 * SEAT_PRICE} USD`);
    });
  });

  describe('conditional messages', () => {
    it('uses the singular form for one seat', async () => {
      await click('add-seat');

      expect(text('seat-message')).toBe('Tienes 1 asiento seleccionado.');
    });

    it('uses the plural form for several seats', async () => {
      await click('add-seat', 2);

      expect(text('seat-message')).toBe('Tienes 2 asientos seleccionados.');
    });

    it('announces the limit when the capacity is reached', async () => {
      await click('add-seat', MAX_SEATS);

      expect(text('seat-message')).toContain('Límite alcanzado');
    });
  });

  describe('edge cases', () => {
    it('disables adding at the limit and never exceeds the maximum', async () => {
      await click('add-seat', MAX_SEATS);

      expect(byTestId('add-seat').disabled).toBe(true);
      byTestId('add-seat').click();
      await fixture.whenStable();
      expect(text('seat-count')).toBe(String(MAX_SEATS));
      expect(text('seat-remaining')).toBe('0');
    });

    it('re-enables adding as soon as a seat is released from the limit', async () => {
      await click('add-seat', MAX_SEATS);
      await click('remove-seat');

      expect(byTestId('add-seat').disabled).toBe(false);
      expect(text('seat-message')).toBe(`Tienes ${MAX_SEATS - 1} asientos seleccionados.`);
    });

    it('never goes below zero when removing from an empty selection', async () => {
      byTestId('remove-seat').click();
      await fixture.whenStable();

      expect(text('seat-count')).toBe('0');
      expect(byTestId('remove-seat').disabled).toBe(true);
    });
  });
});
