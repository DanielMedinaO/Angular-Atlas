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

  it('should render the book explorer lab after the counter on the same page', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const counter = compiled.querySelector('app-counter-demo')!;
    const explorer = compiled.querySelector('app-book-explorer')!;

    expect(explorer).toBeTruthy();
    expect(counter.compareDocumentPosition(explorer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('should document linkedSignal, effect and RxJS and show real code blocks', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';
    const codeBlocks = Array.from(compiled.querySelectorAll('.signals-page__code pre code'));

    expect(text).toContain('linkedSignal()');
    expect(text).toContain('effect()');
    expect(text).toContain('Signals frente a RxJS');
    expect(codeBlocks).toHaveLength(2);
    expect(codeBlocks[1].textContent).toContain('linkedSignal<readonly Book[], Book | null>');
  });
});
