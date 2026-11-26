import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  convertToParamMap,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi } from 'vitest';
import { BOOKS } from './book.model';
import { bookResolver } from './book-resolver';
import { canActivateDemo, canMatchDemo, GuardDemoState } from './guard-demo';
import { canDeactivateNotes, NOTES_CONFIRM, NotesEditorRoute } from './notes-guard';
import { ROUTING_ROUTES } from './routing.routes';

function runInContext<T>(factory: () => T): T {
  return TestBed.runInInjectionContext(factory);
}

describe('Routing guards and resolver as pure functions', () => {
  describe('bookResolver', () => {
    const resolve = (id: string | null) => {
      const paramMap = convertToParamMap(id === null ? {} : { id });
      return runInContext(() => bookResolver({ paramMap } as ActivatedRouteSnapshot, {} as never));
    };

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideRouter(ROUTING_ROUTES)] });
    });

    it('returns the book that matches the :id parameter', () => {
      expect(resolve('effective-typescript')).toBe(BOOKS[2]);
    });

    it.each(['missing-book', '', null])('redirects to the catalog for the id %j', (id) => {
      const result = resolve(id);

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(
        TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo as never),
      ).toBe('/routing/books');
    });
  });

  describe('canDeactivateNotes', () => {
    let confirmSpy: ReturnType<typeof vi.fn<(message: string) => boolean>>;

    beforeEach(() => {
      confirmSpy = vi.fn<(message: string) => boolean>();
      TestBed.configureTestingModule({
        providers: [{ provide: NOTES_CONFIRM, useValue: confirmSpy }],
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const guard = (hasUnsavedChanges: boolean) => {
      const component: NotesEditorRoute = { hasUnsavedChanges: () => hasUnsavedChanges };
      return runInContext(() =>
        canDeactivateNotes(component, {} as never, {} as never, {} as never),
      );
    };

    it('allows leaving without asking when there are no unsaved changes', () => {
      expect(guard(false)).toBe(true);
      expect(confirmSpy).not.toHaveBeenCalled();
    });

    it.each([true, false])(
      'returns the user decision (%s) when changes are unsaved',
      (decision) => {
        confirmSpy.mockReturnValue(decision);

        expect(guard(true)).toBe(decision);
        expect(confirmSpy).toHaveBeenCalledOnce();
        expect(confirmSpy).toHaveBeenCalledWith(expect.stringContaining('cambios sin guardar'));
      },
    );
  });

  describe('demo guards', () => {
    it('reflects the CanActivate permission stored in the shared state', () => {
      const state = TestBed.inject(GuardDemoState);

      expect(runInContext(() => canActivateDemo({} as never, {} as never))).toBe(false);
      state.activationAllowed.set(true);
      expect(runInContext(() => canActivateDemo({} as never, {} as never))).toBe(true);
    });

    it('reflects the CanMatch permission stored in the shared state', () => {
      const state = TestBed.inject(GuardDemoState);
      const matchGuard = () =>
        runInContext(() => canMatchDemo({}, [], {} as Parameters<typeof canMatchDemo>[2]));

      expect(matchGuard()).toBe(false);
      state.matchingAllowed.set(true);
      expect(matchGuard()).toBe(true);
    });

    it('does not leak permissions between tests because TestBed recreates the state', () => {
      expect(TestBed.inject(GuardDemoState).activationAllowed()).toBe(false);
      expect(TestBed.inject(GuardDemoState).matchingAllowed()).toBe(false);
    });
  });
});

describe('Routing feature with the real route configuration', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let confirmDecision: boolean;
  let confirmCalls: string[];

  beforeEach(async () => {
    confirmDecision = false;
    confirmCalls = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'routing', children: ROUTING_ROUTES }], withComponentInputBinding()),
        {
          provide: NOTES_CONFIRM,
          useValue: (message: string) => {
            confirmCalls.push(message);
            return confirmDecision;
          },
        },
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('redirects the feature root and unknown paths to the catalog', async () => {
    await harness.navigateByUrl('/routing');
    expect(router.url).toBe('/routing/books');

    await harness.navigateByUrl('/routing/no-such-page');
    expect(router.url).toBe('/routing/books');
  });

  it.each(BOOKS.map((book) => [book.id, book.title] as const))(
    'resolves the :id parameter %s and renders its title',
    async (id, title) => {
      await harness.navigateByUrl(`/routing/books/${id}`);

      expect(harness.routeNativeElement?.querySelector('h3')?.textContent).toContain(title);
      expect(router.url).toBe(`/routing/books/${id}`);
    },
  );

  it('redirects an unknown book ID back to the catalog', async () => {
    await harness.navigateByUrl('/routing/books/no-existe');

    expect(router.url).toBe('/routing/books');
    expect(harness.routeNativeElement?.querySelector('app-books-catalog')).not.toBeNull();
  });

  it('sets the document title from the route that was activated', async () => {
    await harness.navigateByUrl('/routing/books/angular-cookbook');

    expect(TestBed.inject(Title).getTitle()).toBe('Detalle del libro · Routing · Angular Atlas');
  });

  it('navigates from the catalog to a book by clicking its routerLink', async () => {
    await harness.navigateByUrl('/routing/books');
    const link = harness.routeNativeElement!.querySelector<HTMLAnchorElement>(
      'a[href="/routing/books/effective-typescript"]',
    )!;

    link.click();
    await harness.fixture.whenStable();

    expect(router.url).toBe('/routing/books/effective-typescript');
    expect(harness.routeNativeElement?.querySelector('app-book-detail')).not.toBeNull();
  });

  describe('query parameters', () => {
    it.each([
      ['Angular', 2],
      ['TypeScript', 1],
      ['JavaScript', 1],
      ['Arquitectura', 1],
    ])('filters the catalog by category=%s', async (category, expectedCount) => {
      await harness.navigateByUrl(`/routing/books?category=${category}`);

      expect(harness.routeNativeElement?.querySelectorAll('.books__list li')).toHaveLength(
        expectedCount,
      );
    });

    it('ignores an unknown category instead of rendering an empty catalog', async () => {
      await harness.navigateByUrl('/routing/books?category=Cocina');

      expect(harness.routeNativeElement?.querySelectorAll('.books__list li')).toHaveLength(
        BOOKS.length,
      );
      expect(
        harness.routeNativeElement?.querySelector<HTMLSelectElement>('#book-category')?.value,
      ).toBe('');
    });

    it('clears the query parameter when the user selects all categories', async () => {
      await harness.navigateByUrl('/routing/books?category=Angular');
      const select =
        harness.routeNativeElement!.querySelector<HTMLSelectElement>('#book-category')!;

      select.value = '';
      select.dispatchEvent(new Event('change'));
      await harness.fixture.whenStable();

      expect(router.url).toBe('/routing/books');
    });
  });

  describe('CanDeactivate on the notes editor', () => {
    const typeNote = async (text: string) => {
      const textarea = harness.routeNativeElement!.querySelector('textarea')!;
      textarea.value = text;
      textarea.dispatchEvent(new Event('input'));
      await harness.fixture.whenStable();
    };

    it('lets the user leave when they confirm discarding changes', async () => {
      await harness.navigateByUrl('/routing/notes');
      await typeNote('Borrador');
      confirmDecision = true;

      const navigated = await router.navigateByUrl('/routing/books');

      expect(navigated).toBe(true);
      expect(router.url).toBe('/routing/books');
      expect(confirmCalls).toHaveLength(1);
    });

    it('does not ask again after the note is saved', async () => {
      await harness.navigateByUrl('/routing/notes');
      await typeNote('Nota importante');
      harness
        .routeNativeElement!.querySelector<HTMLButtonElement>('.notes__actions button')!
        .click();
      await harness.fixture.whenStable();

      const navigated = await router.navigateByUrl('/routing/books');

      expect(navigated).toBe(true);
      expect(confirmCalls).toHaveLength(0);
    });

    it('keeps the current URL and the draft when the user cancels', async () => {
      await harness.navigateByUrl('/routing/notes');
      await typeNote('Sigo escribiendo');

      const navigated = await router.navigateByUrl('/routing/books');

      expect(navigated).toBe(false);
      expect(router.url).toBe('/routing/notes');
      expect(harness.routeNativeElement?.querySelector('textarea')?.value).toBe('Sigo escribiendo');
    });
  });

  describe('CanActivate and CanMatch', () => {
    it('rejects the activation while the permission is off and keeps the previous page', async () => {
      await harness.navigateByUrl('/routing/books');

      const result = await router.navigateByUrl('/routing/demo/activate');

      expect(result).toBe(false);
      expect(router.url).toBe('/routing/books');
    });

    it('activates the route as soon as the permission is granted', async () => {
      TestBed.inject(GuardDemoState).activationAllowed.set(true);

      await harness.navigateByUrl('/routing/demo/activate');

      expect(router.url).toBe('/routing/demo/activate');
      expect(harness.routeNativeElement?.textContent).toContain('CanActivate permitió');
    });

    it('selects the first matching route when matching is allowed', async () => {
      TestBed.inject(GuardDemoState).matchingAllowed.set(true);

      await harness.navigateByUrl('/routing/demo/match');

      expect(harness.routeNativeElement?.textContent).toContain('CanMatch permitió');
    });

    it('falls through to the next route with the same path while CanMatch returns false', async () => {
      await harness.navigateByUrl('/routing/demo/match');

      expect(router.url).toBe('/routing/demo/match');
      expect(harness.routeNativeElement?.textContent).toContain('CanMatch devolvió false');
    });
  });
});
