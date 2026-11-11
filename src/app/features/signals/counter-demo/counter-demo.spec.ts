import { TestBed } from '@angular/core/testing';
import { CounterDemoComponent } from './counter-demo';

describe('CounterDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterDemoComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CounterDemoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start at zero for both the count and the doubled value', async () => {
    const fixture = TestBed.createComponent(CounterDemoComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const values = compiled.querySelectorAll('.counter__metric-value');

    expect(values[0].textContent?.trim()).toBe('0');
    expect(values[1].textContent?.trim()).toBe('0');
  });

  it('should update the derived doubled value when the count is incremented', async () => {
    const fixture = TestBed.createComponent(CounterDemoComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelector<HTMLButtonElement>(
      '.counter__button--primary',
    );

    incrementButton?.click();
    await fixture.whenStable();
    incrementButton?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance['count']()).toBe(2);
    expect(fixture.componentInstance['doubled']()).toBe(4);

    const values = compiled.querySelectorAll('.counter__metric-value');
    expect(values[0].textContent?.trim()).toBe('2');
    expect(values[1].textContent?.trim()).toBe('4');
  });

  it('should decrement the count and keep the doubled value in sync', async () => {
    const fixture = TestBed.createComponent(CounterDemoComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const decrementButton = compiled.querySelector<HTMLButtonElement>('.counter__button--ghost');

    decrementButton?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance['count']()).toBe(-1);
    expect(fixture.componentInstance['doubled']()).toBe(-2);
  });

  it('should reset the count and the doubled value back to zero', async () => {
    const fixture = TestBed.createComponent(CounterDemoComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelector<HTMLButtonElement>(
      '.counter__button--primary',
    );
    const resetButton = compiled.querySelector<HTMLButtonElement>('.counter__button--text');

    incrementButton?.click();
    incrementButton?.click();
    await fixture.whenStable();
    resetButton?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance['count']()).toBe(0);
    expect(fixture.componentInstance['doubled']()).toBe(0);
  });
});
