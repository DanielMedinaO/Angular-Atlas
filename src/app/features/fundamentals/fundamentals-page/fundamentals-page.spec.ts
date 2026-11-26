import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';

describe('FundamentalsPage', () => {
  it('loads /fundamentals lazily and renders the complete guide and its links', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const route = routes.find(({ path }) => path === 'fundamentals');
    expect(route?.loadComponent).toBeDefined();
    expect(route?.component).toBeUndefined();

    const harness = await RouterTestingHarness.create('/fundamentals');
    const content = harness.routeNativeElement!;
    expect(content.querySelector('h1')?.textContent).toBe('Fundamentos de Angular');
    expect(content.querySelectorAll('h2')).toHaveLength(12);
    expect(content.querySelectorAll('pre code')).toHaveLength(12);
    expect(content.querySelectorAll('h3')).toHaveLength(4);
    expect(Array.from(content.querySelectorAll('a'), (link) => link.getAttribute('href'))).toEqual([
      '/routing',
      '/dependency-injection',
      '/components',
      '/signals',
      '/components#lifecycle-lab-title',
    ]);
  });
});
