import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { computed, inject, resource, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Component } from '@angular/core';
import {
  catchError,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { BooksApiService } from './books-api.service';
import { searchDemoBooks } from './demo-books';
import {
  normalizeOpenLibraryResponse,
  OpenLibraryBook,
  OpenLibrarySearchResponse,
  OPEN_LIBRARY_RESULT_LIMIT,
  OPEN_LIBRARY_SEARCH_FIELDS,
  OPEN_LIBRARY_SEARCH_URL,
} from './open-library.model';

type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly response: OpenLibrarySearchResponse }
  | { readonly status: 'empty' }
  | { readonly status: 'error'; readonly message: string };

const IDLE_STATE: SearchState = { status: 'idle' };
const LOADING_STATE: SearchState = { status: 'loading' };

function resultState(response: OpenLibrarySearchResponse): SearchState {
  return response.docs.length > 0
    ? { status: 'success', response }
    : { status: 'empty' };
}

function describeHttpError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con Open Library. Comprueba la red; el servicio puede no estar disponible o el navegador puede haber bloqueado la solicitud por CORS.';
    }
    if (error.status === 404) {
      return 'Open Library respondió 404. El recurso de búsqueda no está disponible.';
    }
    if (error.status === 429) {
      return 'Open Library está limitando las solicitudes (429). Espera un momento y vuelve a intentarlo.';
    }
    if (error.status >= 500) {
      return `Open Library no está disponible temporalmente (HTTP ${error.status}).`;
    }
    return `La solicitud a Open Library falló (HTTP ${error.status}).`;
  }

  return 'No se pudo interpretar la respuesta del servicio. Inténtalo de nuevo más tarde.';
}

@Component({
  selector: 'app-http-page',
  templateUrl: './http-page.html',
  styleUrl: './http-page.scss',
})
export class HttpPage {
  private readonly booksApi = inject(BooksApiService);

  protected readonly rxSearchTerm = signal('');
  protected readonly rxDemoMode = signal(false);
  protected readonly resourceSearchTerm = signal('');
  protected readonly resourceDemoMode = signal(false);

  protected readonly rxSearchState = toSignal(
    combineLatest({
      query: toObservable(this.rxSearchTerm).pipe(
        map((query) => query.trim()),
        debounceTime(350),
        distinctUntilChanged(),
        startWith(''),
      ),
      demoMode: toObservable(this.rxDemoMode),
    }).pipe(
      switchMap(({ query, demoMode }): Observable<SearchState> => {
        if (query.length < 2) {
          return of(IDLE_STATE);
        }

        if (demoMode) {
          return of(resultState(searchDemoBooks(query)));
        }

        return this.booksApi.search(query).pipe(
          map(resultState),
          startWith(LOADING_STATE),
          catchError((error: unknown) =>
            of<SearchState>({ status: 'error', message: describeHttpError(error) }),
          ),
        );
      }),
    ),
    { initialValue: IDLE_STATE },
  );

  private readonly debouncedResourceSearchTerm = toSignal(
    toObservable(this.resourceSearchTerm).pipe(debounceTime(350)),
    { initialValue: '' },
  );

  protected readonly booksResource = httpResource<OpenLibrarySearchResponse>(
    () => {
      const query = this.debouncedResourceSearchTerm().trim();
      if (this.resourceDemoMode() || query.length < 2) {
        return undefined;
      }

      return {
        url: OPEN_LIBRARY_SEARCH_URL,
        params: {
          q: query,
          fields: OPEN_LIBRARY_SEARCH_FIELDS.join(','),
          limit: String(OPEN_LIBRARY_RESULT_LIMIT),
        },
      };
    },
    { parse: normalizeOpenLibraryResponse },
  );

  protected readonly resourceDemoResponse = computed(() =>
    this.resourceDemoMode() && this.resourceSearchTerm().trim().length >= 2
      ? searchDemoBooks(this.resourceSearchTerm())
      : null,
  );

  protected readonly promiseTerm = signal('Angular');
  protected readonly promiseResource = resource({
    params: () => ({ term: this.promiseTerm().trim() }),
    loader: async ({ params }) => `Resultado local de resource() para “${params.term}”.`,
  });

  protected readonly observableTerm = signal('Signals');
  protected readonly observableResource = rxResource({
    params: () => ({ term: this.observableTerm().trim() }),
    stream: ({ params }) =>
      of(`Resultado Observable de rxResource() para “${params.term}”.`).pipe(delay(150)),
  });

  protected setRxSearchTerm(event: Event): void {
    this.rxSearchTerm.set((event.target as HTMLInputElement).value);
  }

  protected setResourceSearchTerm(event: Event): void {
    this.resourceSearchTerm.set((event.target as HTMLInputElement).value);
  }

  protected setPromiseTerm(event: Event): void {
    this.promiseTerm.set((event.target as HTMLInputElement).value);
  }

  protected setObservableTerm(event: Event): void {
    this.observableTerm.set((event.target as HTMLInputElement).value);
  }

  protected setRxDemoMode(event: Event): void {
    this.rxDemoMode.set((event.target as HTMLInputElement).checked);
  }

  protected setResourceDemoMode(event: Event): void {
    this.resourceDemoMode.set((event.target as HTMLInputElement).checked);
  }

  protected bookAuthors(book: OpenLibraryBook): string {
    return book.authorNames.length > 0 ? book.authorNames.join(', ') : 'Autor no disponible';
  }

  protected resourceErrorMessage(): string {
    return describeHttpError(this.booksResource.error());
  }

  protected retryResource(): void {
    this.booksResource.reload();
  }

}
