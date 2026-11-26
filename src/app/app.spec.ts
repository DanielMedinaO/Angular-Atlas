import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes, withComponentInputBinding())],
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

  it('should lazy load the Forms page and enable its sidebar navigation item', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/forms');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/forms');
    expect(compiled.querySelector('app-forms-page .forms-page__title')?.textContent).toContain(
      'Formularios',
    );
    expect(compiled.querySelector('app-forms-page #reactive-panel form')).toBeTruthy();
    expect(compiled.querySelector('app-forms-page #signal-panel form')).toBeTruthy();
    expect(compiled.querySelector('.shell__nav-link--active')?.textContent).toContain(
      'Formularios y Signal Forms',
    );
    compiled.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    expect(compiled.querySelector('app-forms-page #signal-panel form')).toBeTruthy();
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

  it('should lazy load the Routing page and keep it available for child routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/routing');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(router.url).toBe('/routing/books');
    expect(compiled.querySelector('app-routing-page .routing-page__title')?.textContent).toContain(
      'Routing y Lazy Loading',
    );
    expect(compiled.querySelector('app-routing-page .routing-page__outlet router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-books-catalog')).toBeTruthy();
    expect(compiled.querySelector('.shell__nav-link--active')?.textContent).toContain(
      'Routing y Lazy Loading',
    );
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
