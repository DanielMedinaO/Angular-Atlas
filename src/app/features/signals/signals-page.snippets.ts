export const SIGNAL_BASICS_SNIPPET = `import { computed, signal } from '@angular/core';

const count = signal(0);                 // estado escribible
const doubled = computed(() => count() * 2); // derivado, solo lectura

count();                  // 0  -> leer = invocar el signal
count.set(5);             // reemplaza el valor: doubled() pasa a 10
count.update(v => v + 1); // deriva del valor anterior: count() es 6

doubled();                // 12 -> se recalculó porque "count" cambió
doubled();                // 12 -> sin cambios: devuelve el valor en caché`;

export const BOOK_EXPLORER_SNIPPET = `// Fuente de verdad: lo único que escribe el usuario.
protected readonly searchTerm = signal('');
protected readonly category = signal<CategoryFilter>(this.readStoredCategory());

// computed(): depende de searchTerm y category. Se recalcula solo si cambia
// alguno de los dos, y es perezoso: no corre hasta que alguien lo lee.
protected readonly filteredBooks = computed(() => {
  const term = normalize(this.searchTerm());
  const category = this.category();

  return BOOK_CATALOG.filter(
    (book) =>
      (category === ALL_CATEGORIES || book.category === category) &&
      (term === '' || normalize(\`\${book.title} \${book.author}\`).includes(term)),
  );
});

protected readonly resultCount = computed(() => this.filteredBooks().length);

// linkedSignal(): se deriva de filteredBooks, pero también admite set().
protected readonly selectedBook = linkedSignal<readonly Book[], Book | null>({
  source: this.filteredBooks,
  computation: (books, previous) =>
    // 1. Si el libro anterior sigue en los resultados, se conserva.
    // 2. Si desapareció, se elige el primer resultado.
    // 3. Si no hay resultados, null.
    books.find((book) => book.id === previous?.value?.id) ?? books[0] ?? null,
});

// Selección manual: set() sobrescribe el valor hasta que "source" cambie.
protected select(book: Book): void {
  this.selectedBook.set(book);
}

constructor() {
  // effect(): efecto secundario hacia el exterior (localStorage).
  // Se ejecuta al inicio y cada vez que category() cambia.
  // No escribe ningún signal: copiar estado se resuelve con computed/linkedSignal.
  effect(() => this.writeStoredCategory(this.category()));
}

private readStoredCategory(): CategoryFilter {
  try {
    const stored = this.getStorage()?.getItem(CATEGORY_STORAGE_KEY);
    return isCategoryFilter(stored) ? stored : ALL_CATEGORIES; // valida el valor
  } catch {
    return ALL_CATEGORIES; // localStorage bloqueado o no disponible
  }
}`;

export const LINKED_VS_COMPUTED_SNIPPET = `const results = signal(['Angular', 'TypeScript', 'RxJS']);

const computedSelection = computed(() => results()[0]);
computedSelection.set('RxJS'); // Error: computed es de solo lectura

const linkedSelection = linkedSignal(() => results()[0]);
linkedSelection();             // 'Angular'
linkedSelection.set('RxJS');   // permitido: selección manual
linkedSelection();             // 'RxJS'

results.set(['Pruebas']);      // la fuente cambia...
linkedSelection();             // 'Pruebas' -> se recalcula y descarta el set() previo`;

export const SIGNALS_VS_RXJS_SNIPPET = `// Signal: siempre tiene un valor actual y se lee de forma síncrona.
const term = signal('');
const upper = computed(() => term().toUpperCase());
upper(); // disponible en cualquier momento, sin suscribirse

// RxJS: describe un flujo de eventos en el tiempo y requiere suscripción.
const term$ = new Subject<string>();
term$.pipe(debounceTime(300), switchMap(t => http.get(\`/api?q=\${t}\`)))
  .subscribe(result => { /* ... */ });

// Interoperabilidad: toSignal(obs$) y toObservable(sig) conectan ambos mundos.`;
