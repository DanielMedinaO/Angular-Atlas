import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssertionsPlayground } from './assertions-playground';

describe('AssertionsPlayground', () => {
  let fixture: ComponentFixture<AssertionsPlayground>;
  let host: HTMLElement;

  const byTestId = (id: string): HTMLElement | null =>
    host.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  const click = async (id: string): Promise<void> => {
    byTestId(id)!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(AssertionsPlayground);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('states that it is an educational simulation and does not run Vitest', () => {
    const notice = byTestId('simulation-notice')?.textContent ?? '';

    expect(notice).toContain('Simulación educativa');
    expect(notice).toContain('no ejecuta Vitest');
  });

  it('starts at zero without any verification result', () => {
    expect(byTestId('counter')?.textContent?.trim()).toBe('0');
    expect(byTestId('empty')).not.toBeNull();
    expect(host.querySelectorAll('tbody tr')).toHaveLength(0);
  });

  it('changes the counter with the plus and minus buttons, including negative values', async () => {
    await click('increment');
    await click('increment');
    expect(byTestId('counter')?.textContent?.trim()).toBe('2');

    await click('decrement');
    await click('decrement');
    await click('decrement');
    expect(byTestId('counter')?.textContent?.trim()).toBe('-1');
  });

  it('shows PASS and FAIL with the expected and received values for the current counter', async () => {
    await click('increment');
    await click('increment');
    await click('increment');
    await click('run');

    const isZero = host.querySelector('[data-testid="result-is-zero"]')!;
    expect(isZero.querySelector('[data-testid="verdict"]')?.textContent?.trim()).toBe('FAIL');
    expect(isZero.querySelector('[data-testid="expected"]')?.textContent?.trim()).toBe('= 0');
    expect(isZero.querySelector('[data-testid="received"]')?.textContent?.trim()).toBe('3');

    const atMostThree = host.querySelector('[data-testid="result-at-most-three"]')!;
    expect(atMostThree.querySelector('[data-testid="verdict"]')?.textContent?.trim()).toBe('PASS');
    expect(byTestId('summary')?.textContent).toContain('contador = 3');
  });

  it('flags the results as stale when the counter changes after running', async () => {
    await click('run');
    expect(byTestId('stale')).toBeNull();

    await click('increment');

    expect(byTestId('stale')).not.toBeNull();
    await click('run');
    expect(byTestId('stale')).toBeNull();
  });

  it('resets the counter and clears every result', async () => {
    await click('increment');
    await click('run');

    await click('reset');

    expect(byTestId('counter')?.textContent?.trim()).toBe('0');
    expect(byTestId('empty')).not.toBeNull();
    expect(byTestId('summary')).toBeNull();
  });
});
