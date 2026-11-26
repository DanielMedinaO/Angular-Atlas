export const examples = {
  matchers: `describe('catálogo', () => {
  it('agrega un libro', () => {
    // Arrange · preparar
    const books: string[] = [];

    // Act · actuar
    books.push('Angular Atlas');

    // Assert · verificar
    expect(books).toEqual(['Angular Atlas']);
    expect(books).toHaveLength(1);
    expect(books).toContain('Angular Atlas');
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toBe('Angular Atlas');
    expect(books[0]).not.toBeUndefined();
  });
});`,
  component: `it('actualiza el total al agregar un asiento', async () => {
  const fixture = TestBed.createComponent(SeatPicker);
  const host = fixture.nativeElement as HTMLElement;
  fixture.detectChanges();

  host.querySelector<HTMLButtonElement>('[data-testid="add-seat"]')!.click();
  await fixture.whenStable();

  expect(host.querySelector('[data-testid="seat-count"]')?.textContent).toBe('1');
  expect(host.querySelector('[data-testid="seat-total"]')?.textContent).toBe('15 USD');
});`,
  mock: `it('solicita y muestra recomendaciones de Signals', async () => {
  const service = {
    recommend: vi.fn<RecommendationService['recommend']>()
      .mockReturnValue([{ id: 'a', title: 'Libro A' }]),
    markAsRead: vi.fn<RecommendationService['markAsRead']>(),
  };
  TestBed.configureTestingModule({
    providers: [{ provide: RecommendationService, useValue: service }],
  });
  const fixture = TestBed.createComponent(RecommendationsLab);
  await fixture.whenStable();

  const host = fixture.nativeElement as HTMLElement;
  host.querySelector<HTMLButtonElement>('[data-testid="topic-signals"]')!.click();
  await fixture.whenStable();

  expect(service.recommend).toHaveBeenCalledWith('signals');
  expect(host.querySelector('[data-testid="list"]')?.textContent).toContain('Libro A');
});`,
  http: `beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
});

afterEach(() => TestBed.inject(HttpTestingController).verify());

it('emite un resultado vacío para la consulta', async () => {
  const http = TestBed.inject(HttpTestingController);
  const result = firstValueFrom(TestBed.inject(BooksApiService).search('vitest'));

  const request = http.expectOne(({ params }) => params.get('q') === 'vitest');
  expect(request.request.method).toBe('GET');
  request.flush({ numFound: 0, docs: [] });

  await expect(result).resolves.toEqual({ numFound: 0, docs: [] });
});`,
  router: `it('filtra el catálogo y redirige si el libro no existe', async () => {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: 'routing', children: ROUTING_ROUTES }], withComponentInputBinding())],
  });
  const harness = await RouterTestingHarness.create();

  await harness.navigateByUrl('/routing/books?category=Angular');
  expect(harness.routeNativeElement?.querySelectorAll('.books__list li')).toHaveLength(2);

  await harness.navigateByUrl('/routing/books/no-existe');
  expect(TestBed.inject(Router).url).toBe('/routing/books');
});`,
  forms: `it('requiere el título en ambos modelos', () => {
  const control = new FormControl('', { nonNullable: true, validators: Validators.required });
  const book = signal({ title: '' });
  const fields = TestBed.runInInjectionContext(() =>
    form(book, (path) => required(path.title)),
  );

  expect(control.hasError('required')).toBe(true);
  expect(fields.title().invalid()).toBe(true);

  control.setValue('Angular Atlas');
  book.set({ title: 'Angular Atlas' });
  expect(control.valid).toBe(true);
  expect(fields.title().valid()).toBe(true);
});`,
  async: `afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('agrupa búsquedas sucesivas en una sola consulta', async () => {
  vi.useFakeTimers();
  const queries = new Subject<string>();
  const lookup = vi.fn<(query: string) => void>();
  const subscription = queries.pipe(debounceTime(300)).subscribe(lookup);
  try {
    queries.next('an');
    queries.next('angular');
    await vi.advanceTimersByTimeAsync(299);
    expect(lookup).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(lookup).toHaveBeenCalledExactlyOnceWith('angular');
  } finally {
    subscription.unsubscribe();
  }
});`,
};
