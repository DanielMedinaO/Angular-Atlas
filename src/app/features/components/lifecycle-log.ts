import {
  afterNextRender,
  DestroyRef,
  inject,
  Injector,
  Service,
  signal,
} from '@angular/core';

export type LifecycleHook =
  | 'ngOnChanges'
  | 'ngOnInit'
  | 'ngAfterContentInit'
  | 'ngAfterViewInit'
  | 'afterNextRender'
  | 'ngOnDestroy'
  | 'DestroyRef.onDestroy';

export interface LifecycleEvent {
  readonly sequence: number;
  readonly instanceId: number;
  readonly hook: LifecycleHook;
  readonly detail: string;
}

export type LifecycleEventInput = Omit<LifecycleEvent, 'sequence'>;

const INSTANCE_HUES: readonly number[] = [170, 215, 280, 25, 340, 50];

// Cada instancia recibe un tono estable; el id numérico siempre se muestra también,
// para que el color nunca sea la única forma de distinguirlas.
export function instanceHue(instanceId: number): number {
  return INSTANCE_HUES[(Math.max(instanceId, 1) - 1) % INSTANCE_HUES.length];
}

/**
 * Registro de eventos del ciclo de vida, con alcance de laboratorio: `autoProvided: false`
 * evita que sea un singleton global; solo existe donde un componente lo declara en `providers`.
 *
 * Los hooks se ejecutan DURANTE la detección de cambios. Escribir aquí un signal que la
 * plantilla ya leyó provocaría un nuevo ciclo (y errores NG0100 en desarrollo), así que
 * `record()` solo anota en un buffer plano y la publicación al signal se difiere a
 * `afterNextRender`, cuando las comprobaciones de Angular ya terminaron.
 */
@Service({ autoProvided: false })
export class LifecycleLog {
  private readonly injector = inject(Injector);
  private readonly entriesState = signal<readonly LifecycleEvent[]>([]);

  readonly entries = this.entriesState.asReadonly();

  private pending: LifecycleEvent[] = [];
  private sequence = 0;
  private flushScheduled = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.pending = [];
    });
  }

  record(event: LifecycleEventInput): void {
    this.pending.push({ ...event, sequence: ++this.sequence });
    this.scheduleFlush();
  }

  clear(): void {
    this.pending = [];
    this.sequence = 0;
    this.entriesState.set([]);
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) {
      return;
    }

    this.flushScheduled = true;
    // Registrar un hook de render también avisa al scheduler zoneless: siempre habrá un render.
    afterNextRender({ read: () => this.flush() }, { injector: this.injector });
  }

  private flush(): void {
    this.flushScheduled = false;

    if (this.pending.length === 0) {
      return;
    }

    const batch = this.pending;
    this.pending = [];
    this.entriesState.update((entries) => [...entries, ...batch]);
  }
}
