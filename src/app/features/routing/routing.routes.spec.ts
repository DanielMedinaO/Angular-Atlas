import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { GuardDemoState } from './guard-demo';
import { NOTES_CONFIRM } from './notes-guard';
import { NotesEditor } from './notes-editor';

describe('Routing feature routes', () => {
  let confirmDecision: boolean;
  let confirmCalls: number;

  beforeEach(() => {
    confirmDecision = false;
    confirmCalls = 0;
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        {
          provide: NOTES_CONFIRM,
          useValue: () => {
            confirmCalls += 1;
            return confirmDecision;
          },
        },
      ],
    });
  });

  it('loads the routing page and its default child route', async () => {
    const harness = await RouterTestingHarness.create('/routing');
    const router = TestBed.inject(Router);
    const page = harness.routeNativeElement;

    expect(router.url).toBe('/routing/books');
    expect(page?.querySelector('.routing-page__title')?.textContent).toContain(
      'Routing y Lazy Loading',
    );
    expect(page?.querySelector('app-books-catalog')).toBeTruthy();
  });

  it('renders each playground child while keeping the parent documentation mounted', async () => {
    const harness = await RouterTestingHarness.create('/routing/books');
    const page = harness.routeNativeElement!;
    const parentPage = page.querySelector('app-routing-page');

    expect(page.querySelector('app-books-catalog')).toBeTruthy();
    await harness.navigateByUrl('/routing/notes');
    expect(harness.routeNativeElement?.querySelector('app-notes-editor')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('app-routing-page')).toBe(parentPage);
    await harness.navigateByUrl('/routing/books/angular-in-depth');
    expect(harness.routeNativeElement?.querySelector('app-book-detail')).toBeTruthy();
  });

  it('filters with query parameters and updates the URL from the category control', async () => {
    const harness = await RouterTestingHarness.create('/routing/books?category=Angular');
    const router = TestBed.inject(Router);
    const catalog = harness.routeNativeElement!;

    expect(catalog.querySelectorAll('.books__list li')).toHaveLength(2);
    expect(catalog.querySelector<HTMLSelectElement>('#book-category')?.value).toBe('Angular');

    const select = catalog.querySelector<HTMLSelectElement>('#book-category')!;
    select.value = 'TypeScript';
    select.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(router.url).toBe('/routing/books?category=TypeScript');
    expect(catalog.querySelectorAll('.books__list li')).toHaveLength(1);
    expect(catalog.textContent).toContain('Effective TypeScript');
  });

  it('supports direct navigation to a book URL and resolves its input before rendering', async () => {
    const harness = await RouterTestingHarness.create(
      '/routing/books/effective-typescript',
    );

    expect(harness.routeNativeElement?.querySelector('h3')?.textContent).toContain(
      'Effective TypeScript',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Dan Vanderkam');
  });

  it('redirects to the catalog when the resolver cannot find the requested book', async () => {
    const harness = await RouterTestingHarness.create('/routing/books/missing-book');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/routing/books');
    expect(harness.routeNativeElement?.querySelector('app-books-catalog')).toBeTruthy();
  });

  it('allows leaving the notes editor without changes without asking for confirmation', async () => {
    const harness = await RouterTestingHarness.create('/routing/notes');
    const router = TestBed.inject(Router);
    const result = await router.navigateByUrl('/routing/books');

    expect(result).toBe(true);
    expect(confirmCalls).toBe(0);
  });

  it('blocks leaving the notes editor when the user chooses to stay', async () => {
    const harness = await RouterTestingHarness.create('/routing/notes');
    const router = TestBed.inject(Router);
    const editor = harness.fixture.debugElement.query(By.directive(NotesEditor))
      .componentInstance as NotesEditor;
    const textarea = harness.routeNativeElement!.querySelector('textarea')!;

    textarea.value = 'Cambios pendientes';
    textarea.dispatchEvent(new Event('input'));
    harness.fixture.detectChanges();
    confirmDecision = false;

    const result = await router.navigateByUrl('/routing/books');

    expect(result).toBe(false);
    expect(router.url).toBe('/routing/notes');
    expect(editor.hasUnsavedChanges()).toBe(true);
    expect(confirmCalls).toBe(1);
  });

  it('blocks activation when CanActivate denies it and allows activation when enabled', async () => {
    const harness = await RouterTestingHarness.create('/routing/books');
    const router = TestBed.inject(Router);
    const state = TestBed.inject(GuardDemoState);

    expect(await router.navigateByUrl('/routing/demo/activate')).toBe(false);
    expect(router.url).toBe('/routing/books');

    state.activationAllowed.set(true);
    expect(await router.navigateByUrl('/routing/demo/activate')).toBe(true);
    expect(harness.routeNativeElement?.textContent).toContain('CanActivate permitió');
  });

  it('uses the fallback route when CanMatch declines and the configured route when enabled', async () => {
    const harness = await RouterTestingHarness.create('/routing/books');
    const router = TestBed.inject(Router);
    const state = TestBed.inject(GuardDemoState);

    await router.navigateByUrl('/routing/demo/match');
    expect(harness.routeNativeElement?.textContent).toContain('CanMatch devolvió false');

    await router.navigateByUrl('/routing/books');
    state.matchingAllowed.set(true);
    await router.navigateByUrl('/routing/demo/match');
    expect(harness.routeNativeElement?.textContent).toContain(
      'CanMatch permitió que esta configuración',
    );
  });
});
