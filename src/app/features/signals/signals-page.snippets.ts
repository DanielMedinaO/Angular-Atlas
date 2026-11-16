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

export const INPUT_API_SNIPPET = `import { Component, input } from '@angular/core';

@Component({ selector: 'app-book-card', /* ... */ })
export class BookCardComponent {
  // Obligatorio: si el padre omite [book], el compilador lo rechaza.
  readonly book = input.required<Book>();

  // Opcional: necesita un valor por defecto y es un InputSignal<boolean>.
  readonly compact = input(false);
}

// Padre:
// <app-book-card [book]="book()" />            -> correcto
// <app-book-card />                            -> error de compilación (falta book)

// Leer un input es invocar el signal: this.book().title
// Es de solo lectura: el hijo no puede hacer this.book.set(...).`;

export const OUTPUT_API_SNIPPET = `// Hijo: declara el evento y lo emite; no conoce al padre.
readonly addRequested = output<string>();

protected requestAdd(): void {
  this.addRequested.emit(this.book().id);
}

// Padre: $event es el valor emitido (aquí, un string con el id).
// <app-book-card (addRequested)="addToReadingList($event)" />

protected addToReadingList(bookId: string): void {
  this.readingList.update((list) => [...list, bookId]);
}`;

export const MODEL_API_SNIPPET = `// Hijo: model() es un signal escribible que también es una entrada y una salida.
readonly favorite = model(false);

protected toggle(): void {
  this.favorite.update((value) => !value); // notifica al padre automáticamente
}

// Padre: [(favorite)] es azúcar sintáctico de
//   [favorite]="isFavorite()" (favoriteChange)="isFavorite.set($event)"
// y enlaza directamente con un WritableSignal.
protected readonly isFavorite = signal(false);

// <app-favorite-toggle [(favorite)]="isFavorite" />`;

export const LEGACY_COMMUNICATION_SNIPPET = `// ---- API tradicional (solo comparación; no usar en código nuevo) ----
@Input({ required: true }) book!: Book;                 // valor mutable, sin signal
@Output() addRequested = new EventEmitter<string>();    // EventEmitter extiende de RxJS Subject
@Input() favorite = false;
@Output() favoriteChange = new EventEmitter<boolean>(); // convención manual "Change"

toggle(): void {
  this.favorite = !this.favorite;
  this.favoriteChange.emit(this.favorite);              // hay que sincronizarlo a mano
}

// ---- API moderna ----
readonly book = input.required<Book>();                 // InputSignal de solo lectura
readonly addRequested = output<string>();               // OutputEmitterRef, sin RxJS
readonly favorite = model(false);                       // entrada + salida + signal

toggle(): void {
  this.favorite.update((value) => !value);              // una sola línea
}`;

export const COMPONENT_COMMUNICATION_SNIPPET = `// ===== BookCardComponent (hijo) =====
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly addRequested = output<string>();

  protected requestAdd(): void {
    this.addRequested.emit(this.book().id);
  }
}

// ===== FavoriteToggleComponent (hijo) =====
export class FavoriteToggleComponent {
  readonly favorite = model(false);

  protected toggle(): void {
    this.favorite.update((value) => !value);
  }
}
// template: <button type="button" [attr.aria-pressed]="favorite()" (click)="toggle()">

// ===== ComponentCommunicationComponent (padre) =====
export class ComponentCommunicationComponent {
  protected readonly book = signal<Book>(EXAMPLE_BOOK);
  protected readonly readingList = signal<string[]>([]);
  protected readonly isFavorite = signal(false);

  protected addToReadingList(bookId: string): void {
    if (this.readingList().includes(bookId)) {
      return; // sin duplicados
    }
    this.readingList.update((list) => [...list, bookId]); // sin mutar el array
  }
}
// template:
// <app-book-card [book]="book()" (addRequested)="addToReadingList($event)" />
// <app-favorite-toggle [(favorite)]="isFavorite" />`;
