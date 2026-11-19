import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { BooksApiService } from './books-api.service';
import { HttpPage } from './http-page';
import {
  normalizeOpenLibraryResponse,
  OPEN_LIBRARY_RESULT_LIMIT,
  OPEN_LIBRARY_SEARCH_FIELDS,
  OPEN_LIBRARY_SEARCH_URL,
} from './open-library.model';
import { requestLoggingInterceptor } from './request-logging.interceptor';

const apiResponse = {
  numFound: 1,
  docs: [
    {
      key: '/works/OL1W',
      title: 'Angular in Practice',
      author_name: ['Ada Example'],
      first_publish_year: 2020,
      cover_i: 123,
    },
  ],
};

function requestMatcher(url = OPEN_LIBRARY_SEARCH_URL) {
  return (request: { url: string }) => request.url === url;
}

describe('Open Library response normalization', () => {
  it('normalizes missing and malformed optional fields', () => {
    expect(
      normalizeOpenLibraryResponse({
        numFound: 1,
        docs: [
          { key: '/works/OL2W', title: 'Optional fields omitted' },
          {
            key: '/works/OL3W',
            title: 'Optional fields with invalid values',
            author_name: ['A Writer', 2, null],
            first_publish_year: 'unknown',
            cover_i: 4.5,
          },
        ],
      }),
    ).toEqual({
      numFound: 1,
      docs: [
        {
          key: '/works/OL2W',
          title: 'Optional fields omitted',
          authorNames: [],
          firstPublishYear: null,
          coverId: null,
        },
        {
          key: '/works/OL3W',
          title: 'Optional fields with invalid values',
          authorNames: ['A Writer'],
          firstPublishYear: null,
          coverId: null,
        },
      ],
    });
  });

  it('rejects a response that does not match the runtime JSON shape', () => {
    expect(() => normalizeOpenLibraryResponse({ docs: 'not-an-array' })).toThrow(TypeError);
  });
});

describe('BooksApiService', () => {
  let api: BooksApiService;
  let http: HttpTestingController;
  let consoleInfo: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([requestLoggingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    api = TestBed.inject(BooksApiService);
    http = TestBed.inject(HttpTestingController);
    consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('sends a GET with the query, requested fields, and ten-result limit', () => {
    let response: unknown;
    api.search('angular').subscribe((value) => (response = value));

    const request = http.expectOne(requestMatcher());
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe('angular');
    expect(request.request.params.get('fields')).toBe(OPEN_LIBRARY_SEARCH_FIELDS.join(','));
    expect(request.request.params.get('limit')).toBe(String(OPEN_LIBRARY_RESULT_LIMIT));
    request.flush(apiResponse);

    expect(response).toEqual({
      numFound: 1,
      docs: [
        {
          key: '/works/OL1W',
          title: 'Angular in Practice',
          authorNames: ['Ada Example'],
          firstPublishYear: 2020,
          coverId: 123,
        },
      ],
    });
  });

  it('returns a successful empty result without disguising it as an error', () => {
    let response: { numFound: number; docs: readonly unknown[] } | undefined;
    api.search('no matching title').subscribe((value) => (response = value));

    http.expectOne(requestMatcher()).flush({ numFound: 0, docs: [] });

    expect(response).toEqual({ numFound: 0, docs: [] });
  });

  it.each([404, 500])('surfaces HTTP %i errors', (status) => {
    let error: unknown;
    api.search('angular').subscribe({ error: (value: unknown) => (error = value) });

    http.expectOne(requestMatcher()).flush('request failed', {
      status,
      statusText: 'Request failed',
    });

    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect((error as HttpErrorResponse).status).toBe(status);
  });

  it('surfaces network errors', () => {
    let error: unknown;
    api.search('angular').subscribe({ error: (value: unknown) => (error = value) });

    http.expectOne(requestMatcher()).error(new ProgressEvent('error'));

    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect((error as HttpErrorResponse).status).toBe(0);
  });

  it('logs method, URL without search parameters, status, and elapsed time', () => {
    api.search('private search text').subscribe();
    http.expectOne(requestMatcher()).flush(apiResponse);

    expect(consoleInfo).toHaveBeenCalledOnce();
    const loggedDetails = consoleInfo.mock.calls[0][1] as Record<string, unknown>;
    expect(loggedDetails).toEqual({
      method: 'GET',
      url: OPEN_LIBRARY_SEARCH_URL,
      status: 200,
      elapsedMs: expect.any(Number),
    });
    expect(JSON.stringify(loggedDetails)).not.toContain('private search text');
  });
});

describe('HTTP labs', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpPage],
      providers: [
        provideHttpClient(withInterceptors([requestLoggingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders documentation and local fixtures are clearly identified', () => {
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('HTTP y recursos');
    expect(page.textContent).toContain('HttpClient');
    expect(page.textContent).toContain('switchMap()');
    expect(page.querySelector('#rx-search')).toBeTruthy();
    expect(page.querySelector('#resource-search')).toBeTruthy();

    fixture.componentInstance['rxDemoMode'].set(true);
    fixture.componentInstance['rxSearchTerm'].set('angular');
    fixture.detectChanges();
    vi.useFakeTimers();
    vi.advanceTimersByTime(350);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('datos ficticios locales');
    expect(http.match(requestMatcher())).toHaveLength(0);
    fixture.destroy();
  });

  it('debounces RxJS searches, ignores terms shorter than two characters, and cancels stale requests', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();

    fixture.componentInstance['rxSearchTerm'].set('a');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    expect(http.match(requestMatcher())).toHaveLength(0);

    fixture.componentInstance['rxSearchTerm'].set('angular');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(349);
    expect(http.match(requestMatcher())).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    fixture.detectChanges();

    const firstRequest = http.expectOne(requestMatcher());
    expect(fixture.componentInstance['rxSearchState']().status).toBe('loading');

    fixture.componentInstance['rxSearchTerm'].set('rxjs');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    expect(firstRequest.cancelled).toBe(true);

    const secondRequest = http.expectOne(requestMatcher());
    secondRequest.flush({ numFound: 0, docs: [] });
    fixture.detectChanges();
    expect(fixture.componentInstance['rxSearchState']().status).toBe('empty');
    fixture.destroy();
  });

  it('keeps an HTTP failure distinct from an empty RxJS result', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();

    fixture.componentInstance['rxSearchTerm'].set('missing');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    http.expectOne(requestMatcher()).flush('not found', {
      status: 404,
      statusText: 'Not found',
    });
    fixture.detectChanges();

    expect(fixture.componentInstance['rxSearchState']().status).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Open Library respondió 404');
    fixture.destroy();
  });

  it('tracks httpResource loading, empty, success, and reload after an HTTP error', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page['resourceSearchTerm'].set('angular');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    const firstRequest = http.expectOne(requestMatcher());
    expect(firstRequest.request.params.get('q')).toBe('angular');
    expect(firstRequest.request.params.get('fields')).toBe(OPEN_LIBRARY_SEARCH_FIELDS.join(','));
    expect(firstRequest.request.params.get('limit')).toBe(String(OPEN_LIBRARY_RESULT_LIMIT));
    expect(page['booksResource'].isLoading()).toBe(true);

    vi.useRealTimers();
    firstRequest.flush({ numFound: 0, docs: [] });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page['booksResource'].hasValue()).toBe(true);
    expect(page['booksResource'].value()?.docs).toEqual([]);

    page['retryResource']();
    fixture.detectChanges();
    const retryRequest = http.expectOne(requestMatcher());
    retryRequest.flush('temporary failure', { status: 500, statusText: 'Server error' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page['booksResource'].error()).toBeInstanceOf(HttpErrorResponse);
    expect(() => page['booksResource'].value()).toThrow();

    page['retryResource']();
    fixture.detectChanges();
    http.expectOne(requestMatcher()).flush(apiResponse);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page['booksResource'].hasValue()).toBe(true);
    expect(page['booksResource'].value()?.docs[0]?.title).toBe('Angular in Practice');
    fixture.destroy();
  });

  it('cancels an obsolete httpResource request when its debounced parameters change', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page['resourceSearchTerm'].set('angular');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    const firstRequest = http.expectOne(requestMatcher());

    page['resourceSearchTerm'].set('signals');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();

    expect(firstRequest.cancelled).toBe(true);
    http.expectOne(requestMatcher()).flush(apiResponse);
    fixture.destroy();
  });

  it('renders the resource demos as distinct Promise and Observable examples', async () => {
    const fixture = TestBed.createComponent(HttpPage);
    fixture.detectChanges();

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Resultado local de resource()');
    });

    fixture.componentInstance['observableTerm'].set('HTTP');
    fixture.detectChanges();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Resultado Observable de rxResource() para “HTTP”');
    });
    expect(http.match(requestMatcher())).toHaveLength(0);
    fixture.destroy();
  });
});
