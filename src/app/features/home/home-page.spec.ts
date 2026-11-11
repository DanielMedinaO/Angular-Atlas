import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

  it('should render a topic card for every topic, linking only the available ones', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.topic-card');
    const links = compiled.querySelectorAll('a.topic-card');

    expect(cards.length).toBe(fixture.componentInstance['topics'].length);
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/signals');
  });
});
