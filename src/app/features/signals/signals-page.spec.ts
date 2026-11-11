import { TestBed } from '@angular/core/testing';
import { SignalsPage } from './signals-page';

describe('SignalsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsPage],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignalsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the documentation and the live lab with the counter demo', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.signals-page__title')?.textContent).toContain('Signals');
    expect(compiled.querySelector('.signals-page__lab')).toBeTruthy();
    expect(compiled.querySelector('app-counter-demo')).toBeTruthy();
  });
});
