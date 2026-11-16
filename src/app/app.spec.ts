import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell with the Angular Atlas brand', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shell__brand')?.textContent).toContain('Angular Atlas');
  });

  it('should lazy load the Home page on the root route', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-home-page')).toBeTruthy();
  });

  it('should lazy load the Signals page with documentation and lab together', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/signals');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-signals-page .signals-page__docs')).toBeTruthy();
    expect(compiled.querySelector('app-signals-page .signals-page__lab app-counter-demo')).toBeTruthy();
  });

  it('should lazy load the Components page with documentation and the lifecycle lab together', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/components');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/components');
    expect(compiled.querySelector('app-components-page .components-page__title')?.textContent).toContain(
      'Componentes y ciclo de vida',
    );
    expect(compiled.querySelector('app-components-page .components-page__lab app-lifecycle-lab')).toBeTruthy();
    expect(compiled.querySelector('.shell__nav-link--active')?.textContent).toContain('Componentes');
  });

  it('should redirect unknown URLs to the home page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/ruta/que/no-existe');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/');
    expect(compiled.querySelector('app-home-page')).toBeTruthy();
  });
});
