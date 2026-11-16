export const CONSTRUCTOR_VS_ONINIT_SNIPPET = `export class ReadingPanel implements OnInit {
  readonly instanceId = input.required<number>();
  readonly density = input<PanelDensity>('comfortable');

  constructor() {
    // Contexto de inyección: aquí se registran hooks de render y callbacks de destrucción.
    // Los inputs todavía NO tienen valor: leer instanceId() aquí lanzaría un error.
    afterNextRender({ read: () => this.measure() });
  }

  ngOnInit(): void {
    // Los inputs ya fueron asignados por el padre.
    this.record('ngOnInit', \`inputs disponibles: density=\${this.density()}\`);
  }
}`;

export const ON_CHANGES_SNIPPET = `ngOnChanges(changes: SimpleChanges): void {
  for (const [name, change] of Object.entries(changes)) {
    const origin = change.firstChange ? 'valor inicial' : \`\${change.previousValue}\`;
    this.record('ngOnChanges', \`\${name}: \${origin} → \${change.currentValue}\`);
  }
}

// Se dispara al crear el componente (firstChange) y cada vez que el padre
// cambia un input enlazado. Con signal inputs también funciona; si solo necesitas
// reaccionar al valor, computed() o effect() suelen ser más simples.`;

export const CONTENT_VIEW_HOOKS_SNIPPET = `ngAfterContentInit(): void {
  // El contenido proyectado por el padre ya existe y contentChild() está resuelto.
  this.record('ngAfterContentInit', \`título: \${this.hasTitle() ? 'encontrado' : 'undefined'}\`);
}

ngAfterViewInit(): void {
  // La plantilla del propio componente ya existe y viewChild() está resuelto.
  this.record('ngAfterViewInit', \`surface: \${this.hasSurface() ? 'encontrado' : 'undefined'}\`);
}

// ⚠ No escribas aquí signals que la plantilla ya leyó: Angular ya comprobó esa vista
// y verías NG0100 en desarrollo. El laboratorio usa un buffer y publica en afterNextRender.`;

export const CHECKED_HOOKS_SNIPPET = `// Se ejecutan en CADA ciclo de detección de cambios, por eso el laboratorio no los registra.
ngAfterContentChecked(): void { /* tras comprobar el contenido proyectado */ }
ngAfterViewChecked(): void    { /* tras comprobar la vista y sus hijos */ }

// Cualquier trabajo costoso aquí se paga en cada interacción. Prefiere signals,
// computed() y afterNextRender() en lugar de estos hooks.`;

export const DESTROY_SNIPPET = `export class ReadingPanel implements OnDestroy {
  constructor() {
    // DestroyRef: registra la limpieza junto al recurso que la necesita, sin implementar interfaces.
    inject(DestroyRef).onDestroy(() =>
      this.record('DestroyRef.onDestroy', 'callback registrado con DestroyRef'),
    );
  }

  ngOnDestroy(): void {
    this.record('ngOnDestroy', 'el panel se retira de la vista');
  }
}

// DestroyRef también funciona en servicios y funciones reutilizables
// (por ejemplo dentro de un helper que llama a inject(DestroyRef)).`;

export const VIEW_QUERIES_SNIPPET = `// ReadingPanel: elemento de SU plantilla (<section #surface>).
private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
readonly hasSurface = computed(() => this.surface() !== undefined);

// LifecycleLab: componente hijo declarado en SU plantilla dentro de un @if.
protected readonly panel = viewChild(ReadingPanel); // ReadingPanel | undefined

// Variantes (adaptado):
private readonly surfaceRequired = viewChild.required<ElementRef<HTMLElement>>('surface');
private readonly allPanels = viewChildren(ReadingPanel);   // Signal<readonly ReadingPanel[]>
readonly panelCount = computed(() => this.allPanels().length);`;

export const CONTENT_QUERIES_SNIPPET = `// ReadingPanel: busca lo que el PADRE proyectó. Es opcional, así que puede ser undefined.
private readonly title = contentChild(ReadingPanelTitle);
readonly hasTitle = computed(() => this.title() !== undefined);
protected readonly labelledBy = computed(() => this.title()?.id ?? null);

// Variantes (adaptado):
private readonly requiredTitle = contentChild.required(ReadingPanelTitle); // error si falta
private readonly notes = contentChildren(ReadingPanelNote);                // Signal<readonly ReadingPanelNote[]>
// descendants: por defecto contentChild sí busca en descendientes; contentChildren no.
private readonly allNotes = contentChildren(ReadingPanelNote, { descendants: true });`;

export const PROJECTION_SNIPPET = `<!-- reading-panel.html: los <ng-content> NUNCA van dentro de @if -->
<section #surface class="reading-panel" [attr.aria-labelledby]="labelledBy()">
  <header class="reading-panel__header" [hidden]="!hasTitle()">
    <ng-content select="[readingPanelTitle]" />   <!-- slot con nombre -->
  </header>

  <div class="reading-panel__body">
    <ng-content />                                <!-- slot por defecto -->
  </div>
</section>

<!-- lifecycle-lab.html: el contenido condicional vive en el PADRE -->
<app-reading-panel [instanceId]="id" [density]="density()">
  @if (showTitle()) {
    <h3 readingPanelTitle>Lectura recomendada #{{ id }}</h3>
  }
  <p>Este texto se proyecta en el slot principal.</p>
</app-reading-panel>`;

export const AFTER_NEXT_RENDER_SNIPPET = `constructor() {
  afterNextRender({
    // earlyRead → write → mixedReadWrite → read: cada fase ordena lecturas y escrituras
    // del DOM para evitar layout thrashing entre callbacks.
    read: () => {
      const element = this.surface()?.nativeElement;
      if (!element) return;

      const width = Math.round(element.getBoundingClientRect().width);
      this.measuredWidth.set(width); // escribir signals aquí está permitido: se renderiza de nuevo
    },
  });
}

// Solo se ejecuta en el navegador (nunca durante SSR) y una única vez.
// Si necesitas repetirlo en cada render usa afterEveryRender().`;

export const LIFECYCLE_LOG_SNIPPET = `@Service({ autoProvided: false }) // no es global: se declara en providers del laboratorio
export class LifecycleLog {
  private readonly injector = inject(Injector);
  private readonly entriesState = signal<readonly LifecycleEvent[]>([]);
  readonly entries = this.entriesState.asReadonly();
  private pending: LifecycleEvent[] = []; // buffer plano: no dispara nada

  record(event: LifecycleEventInput): void {
    this.pending.push({ ...event, sequence: ++this.sequence });
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    afterNextRender({ read: () => this.flush() }, { injector: this.injector });
  }

  private flush(): void {
    this.flushScheduled = false;
    const batch = this.pending;
    this.pending = [];
    this.entriesState.update((entries) => [...entries, ...batch]); // ya fuera de la comprobación
  }
}

// En el laboratorio: @Component({ providers: [LifecycleLog] })
// El panel lo inyecta con inject(LifecycleLog, { optional: true }).`;

export const LEGACY_QUERIES_SNIPPET = `// Decoradores tradicionales
@ViewChild('surface') surface?: ElementRef<HTMLElement>;
@ContentChild(ReadingPanelTitle) title?: ReadingPanelTitle;
@ViewChildren(ReadingPanel) panels!: QueryList<ReadingPanel>;

ngAfterViewInit() {
  // Solo aquí es seguro leer surface; antes es undefined.
  this.panels.changes.subscribe(() => { /* ... */ }); // suscripción manual
}

// APIs modernas (signal queries)
private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
private readonly title = contentChild(ReadingPanelTitle);
private readonly panels = viewChildren(ReadingPanel);

readonly count = computed(() => this.panels().length); // sin QueryList ni suscripciones`;
