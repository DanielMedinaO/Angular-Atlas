import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignalsPage } from './signals-page';

describe('SignalsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsPage],
      providers: [provideRouter([])],
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
    expect(compiled.querySelector('.signals-page__objective')?.textContent).toContain('Objetivo');
    expect(compiled.querySelector('#signals-challenge-title')?.textContent).toContain('Practica');
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
    expect(codeBlocks).toHaveLength(3);
    expect(codeBlocks[1].textContent).toContain('linkedSignal<readonly Book[], Book | null>');
  });

  it('should render the component communication lab after the explorer without leaving the page', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const explorer = compiled.querySelector('app-book-explorer')!;
    const communication = compiled.querySelector('app-component-communication')!;

    expect(communication).toBeTruthy();
    expect(
      explorer.compareDocumentPosition(communication) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(communication.querySelector('app-book-card')).toBeTruthy();
    expect(communication.querySelector('app-favorite-toggle')).toBeTruthy();
    expect(compiled.querySelectorAll('.signals-page__lab')).toHaveLength(3);
  });

  it('should document input, output, model and the legacy comparison with the real component code', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';
    const codeBlocks = Array.from(compiled.querySelectorAll('.signals-page__code pre code'));

    expect(text).toContain('input.required()');
    expect(text).toContain('$event');
    expect(text).toContain('[(favorite)]');
    expect(text).toContain('@Input()');
    expect(text).toContain('EventEmitter');
    expect(codeBlocks[2].textContent).toContain('output<string>()');
    expect(codeBlocks[2].textContent).toContain('model(false)');
  });

  it('should keep the counter and the explorer working next to the new lab', async () => {
    const fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('app-counter-demo button')!.click();
    compiled.querySelector<HTMLButtonElement>('app-component-communication .book-card__add')!.click();
    await fixture.whenStable();

    expect(compiled.querySelector('app-book-explorer .explorer__item')).toBeTruthy();
    expect(compiled.querySelector('app-component-communication .communication__list li')).toBeTruthy();
  });
});
