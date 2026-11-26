import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, switchMap } from 'rxjs';
import { BooksApiService } from './books-api.service';
import {
  OPEN_LIBRARY_RESULT_LIMIT,
  OPEN_LIBRARY_SEARCH_FIELDS,
  OPEN_LIBRARY_SEARCH_URL,
  OpenLibrarySearchResponse,
} from './open-library.model';

const SUCCESS_BODY = {
  numFound: 2,
  docs: [
    {
      key: '/works/OL1W',
      title: 'Testing Angular',
      author_name: ['Ada Example'],
      first_publish_year: 2024,
      cover_i: 7,
    },
    { key: '/works/OL2W', title: 'Vitest en la práctica' },
  ],
};

interface Outcome<T> {
  value?: T;
  error?: unknown;
  completed: boolean;
}

function observe<T>(source: Observable<T>) {
  const outcome: Outcome<T> = { completed: false };
  const subscription = source.subscribe({
    next: (value) => (outcome.value = value),
    error: (error: unknown) => (outcome.error = error),
    complete: () => (outcome.completed = true),
  });
  return { outcome, subscription };
}

describe('BooksApiService with HttpTestingController', () => {
  let api: BooksApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    // provideHttpClient() va primero: provideHttpClientTesting() sustituye solo el backend.
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(BooksApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  const expectSearchRequest = () =>
    http.expectOne((request) => request.url === OPEN_LIBRARY_SEARCH_URL);

  describe('successful GET', () => {
    it('sends a single GET to the search endpoint and normalizes the body', () => {
      const { outcome } = observe<OpenLibrarySearchResponse>(api.search('testing'));

      const request = expectSearchRequest();
      expect(request.request.method).toBe('GET');
      request.flush(SUCCESS_BODY);

      expect(outcome.completed).toBe(true);
      expect(outcome.value).toEqual({
        numFound: 2,
        docs: [
          {
            key: '/works/OL1W',
            title: 'Testing Angular',
            authorNames: ['Ada Example'],
            firstPublishYear: 2024,
            coverId: 7,
          },
          {
            key: '/works/OL2W',
            title: 'Vitest en la práctica',
            authorNames: [],
            firstPublishYear: null,
            coverId: null,
          },
        ],
      });
    });
  });

  describe('search parameters', () => {
    it('sends the query, the requested fields and the result limit as URL parameters', () => {
      observe(api.search('angular signals'));

      const { params } = expectSearchRequest().request;

      expect(params.get('q')).toBe('angular signals');
      expect(params.get('fields')).toBe(OPEN_LIBRARY_SEARCH_FIELDS.join(','));
      expect(params.get('limit')).toBe(String(OPEN_LIBRARY_RESULT_LIMIT));
    });

    it('keeps special characters as data instead of splitting them into other parameters', () => {
      observe(api.search('c++ & rxjs=ok'));

      const { params } = expectSearchRequest().request;

      expect(params.get('q')).toBe('c++ & rxjs=ok');
      expect(params.keys().sort()).toEqual(['fields', 'limit', 'q']);
    });
  });

  describe('empty responses', () => {
    it('emits an empty result and completes without an error', () => {
      const { outcome } = observe<OpenLibrarySearchResponse>(api.search('sin resultados'));

      expectSearchRequest().flush({ numFound: 0, docs: [] });

      expect(outcome.value).toEqual({ numFound: 0, docs: [] });
      expect(outcome.error).toBeUndefined();
      expect(outcome.completed).toBe(true);
    });
  });

  describe('HTTP errors', () => {
    it('surfaces a 404 as an HttpErrorResponse without emitting a value', () => {
      const { outcome } = observe(api.search('missing'));

      expectSearchRequest().flush('Not found', { status: 404, statusText: 'Not Found' });

      expect(outcome.value).toBeUndefined();
      expect(outcome.error).toBeInstanceOf(HttpErrorResponse);
      expect((outcome.error as HttpErrorResponse).status).toBe(404);
      expect((outcome.error as HttpErrorResponse).statusText).toBe('Not Found');
    });

    it('surfaces a 500 as an HttpErrorResponse', () => {
      const { outcome } = observe(api.search('angular'));

      expectSearchRequest().flush(
        { message: 'boom' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(outcome.error).toBeInstanceOf(HttpErrorResponse);
      expect((outcome.error as HttpErrorResponse).status).toBe(500);
      expect((outcome.error as HttpErrorResponse).error).toEqual({ message: 'boom' });
    });
  });

  describe('network errors', () => {
    it('reports status 0 and keeps the original ProgressEvent as the error cause', () => {
      const { outcome } = observe(api.search('angular'));
      const networkFailure = new ProgressEvent('error');

      expectSearchRequest().error(networkFailure);

      expect(outcome.error).toBeInstanceOf(HttpErrorResponse);
      expect((outcome.error as HttpErrorResponse).status).toBe(0);
      expect((outcome.error as HttpErrorResponse).error).toBe(networkFailure);
    });
  });

  describe('unexpected response shape', () => {
    it('fails with a TypeError when a 200 response does not match the contract', () => {
      const { outcome } = observe(api.search('angular'));

      expectSearchRequest().flush({ docs: 'no-es-una-lista' });

      expect(outcome.error).toBeInstanceOf(TypeError);
      expect(outcome.value).toBeUndefined();
    });
  });

  describe('cancellation and stale requests', () => {
    it('cancels the HTTP request when the subscriber unsubscribes', () => {
      const { outcome, subscription } = observe(api.search('angular'));
      const request = expectSearchRequest();

      subscription.unsubscribe();

      expect(request.cancelled).toBe(true);
      expect(outcome.value).toBeUndefined();
    });

    it('does not accept a response for a request that was already cancelled', () => {
      const { subscription } = observe(api.search('angular'));
      const request = expectSearchRequest();
      subscription.unsubscribe();

      expect(() => request.flush(SUCCESS_BODY)).toThrow();
    });

    it('ignores the stale search when switchMap receives a newer query', () => {
      const queries = new Subject<string>();
      const received: OpenLibrarySearchResponse[] = [];
      const subscription = queries
        .pipe(switchMap((query) => api.search(query)))
        .subscribe((response) => received.push(response));

      queries.next('angular');
      const [stale] = http.match((request) => request.url === OPEN_LIBRARY_SEARCH_URL);
      queries.next('vitest');
      const [latest] = http.match((request) => request.url === OPEN_LIBRARY_SEARCH_URL);

      expect(stale.cancelled).toBe(true);
      expect(latest.cancelled).toBe(false);
      expect(latest.request.params.get('q')).toBe('vitest');

      latest.flush({ numFound: 0, docs: [] });
      expect(received).toEqual([{ numFound: 0, docs: [] }]);
      subscription.unsubscribe();
    });
  });
});
