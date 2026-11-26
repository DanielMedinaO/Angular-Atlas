import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TOPICS } from '../../core/shell/navigation';
import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a hero CTA linking to the Signals page', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const cta = compiled.querySelector('.home-page__cta');

    expect(cta).toBeTruthy();
    expect(cta?.getAttribute('href')).toBe('/signals');
  });

  it('should render a card for every centralized topic, linking only the available ones', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const titles = Array.from(compiled.querySelectorAll('.topic-card__title')).map((title) =>
      title.textContent?.trim(),
    );
    const links = Array.from(compiled.querySelectorAll('a.topic-card'));
    const availableTopics = TOPICS.filter((topic) => topic.status === 'available');

    expect(titles).toEqual(TOPICS.map((topic) => topic.label));
    expect(titles).not.toContain('Inicio');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      availableTopics.map((topic) => ('path' in topic ? topic.path : undefined)),
    );
    expect(compiled.querySelectorAll('.topic-card__badge')).toHaveLength(
      TOPICS.length - availableTopics.length,
    );
  });

  it('links to Fundamentos and RxJS from the home page', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.topic-card[href="/fundamentals"] h3')?.textContent).toContain(
      'Fundamentos de Angular',
    );
    expect(compiled.querySelector('a.topic-card[href="/rxjs"] h3')?.textContent).toContain('RxJS');
  });

  it('should keep unavailable cards non-interactive and available cards as native links', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const card of compiled.querySelectorAll('.topic-card--disabled')) {
      expect(card.tagName).toBe('DIV');
      expect(card.querySelector('a, button')).toBeNull();
    }
    for (const card of compiled.querySelectorAll('a.topic-card')) {
      expect(card.getAttribute('href')).toBeTruthy();
      expect(card.querySelector('h3')).toBeTruthy();
    }
  });
});
