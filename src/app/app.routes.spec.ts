import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { NAV_ITEMS } from './core/shell/navigation';

describe('Application routes', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('keeps every feature route lazy', () => {
    const featureRoutes = routes.filter((route) => route.path && route.path !== '**');

    expect(featureRoutes.length).toBeGreaterThan(0);
    for (const route of featureRoutes) {
      expect(
        Boolean(route.loadComponent || route.loadChildren),
        `route "${route.path}" should be lazy`,
      ).toBe(true);
      expect(route.component, `route "${route.path}" should not be eager`).toBeUndefined();
    }
  });

  it('renders the home page for the empty path', async () => {
    await harness.navigateByUrl('/');

    expect(harness.routeNativeElement?.matches('app-home-page')).toBe(true);
    expect(TestBed.inject(Title).getTitle()).toBe('Angular Atlas');
  });

  it('loads the lazy Testing page and sets its title', async () => {
    await harness.navigateByUrl('/testing');

    expect(router.url).toBe('/testing');
    expect(harness.routeNativeElement?.matches('app-testing-page')).toBe(true);
    expect(harness.routeNativeElement?.querySelectorAll('section > h2')).toHaveLength(9);
    expect(harness.routeNativeElement?.querySelector('app-assertions-playground')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-seat-picker')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-recommendations-lab')).not.toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('Testing con Vitest · Angular Atlas');
  });

  it('loads the lazy performance labs and keeps the graph deferred', async () => {
    await harness.navigateByUrl('/performance');

    expect(router.url).toBe('/performance');
    expect(harness.routeNativeElement?.matches('app-performance-page')).toBe(true);
    expect(harness.routeNativeElement?.querySelectorAll('section > h2')).toHaveLength(4);
    expect(harness.routeNativeElement?.querySelector('app-performance-reading-chart')).toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('Rendimiento y optimización · Angular Atlas');
  });

  it('navigates between pages while keeping a single active route at a time', async () => {
    await harness.navigateByUrl('/signals');
    expect(harness.routeNativeElement?.matches('app-signals-page')).toBe(true);

    await harness.navigateByUrl('/forms');
    expect(harness.routeNativeElement?.matches('app-forms-page')).toBe(true);
    expect(harness.fixture.nativeElement.querySelector('app-signals-page')).toBeNull();
  });

  it('redirects unknown URLs to the home page', async () => {
    await harness.navigateByUrl('/this/page/does/not/exist');

    expect(router.url).toBe('/');
    expect(harness.routeNativeElement?.matches('app-home-page')).toBe(true);
  });

  it.each(NAV_ITEMS.filter((item) => item.status === 'available').map((item) => item.path))(
    'serves the available sidebar topic %s without falling into the wildcard redirect',
    async (path) => {
      await harness.navigateByUrl(path);

      expect(router.url.startsWith(path)).toBe(true);
    },
  );
});
