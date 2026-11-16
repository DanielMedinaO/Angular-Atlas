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

    expect(titles).toEqual(TOPICS.map((topic) => topic.label));
    expect(titles).not.toContain('Inicio');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/components', '/signals']);
    expect(compiled.querySelectorAll('.topic-card__badge')).toHaveLength(TOPICS.length - 2);
  });
});
