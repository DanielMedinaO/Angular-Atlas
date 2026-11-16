import {
  AfterContentInit,
  AfterViewInit,
  afterNextRender,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { instanceHue, LifecycleHook, LifecycleLog } from '../lifecycle-log';
import { ReadingPanelTitle } from './reading-panel-title';

export type PanelDensity = 'comfortable' | 'compact';

@Component({
  selector: 'app-reading-panel',
  templateUrl: './reading-panel.html',
  styleUrl: './reading-panel.scss',
  host: { '[style.--instance-hue]': 'hue()' },
})
export class ReadingPanel implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  readonly instanceId = input.required<number>();
  readonly density = input<PanelDensity>('comfortable');

  // Consulta de vista: un elemento de la plantilla de ESTE componente.
  private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
  // Consulta de contenido: algo que el PADRE proyectó; es undefined si no lo hizo.
  private readonly title = contentChild(ReadingPanelTitle);

  // El registro es opcional: el panel es reutilizable y funciona sin laboratorio.
  private readonly log = inject(LifecycleLog, { optional: true });
  private readonly measuredWidth = signal<number | null>(null);
  private knownInstanceId: number | null = null;

  readonly initialWidth = this.measuredWidth.asReadonly();
  readonly hasSurface = computed(() => this.surface() !== undefined);
  readonly hasTitle = computed(() => this.title() !== undefined);

  protected readonly hue = computed(() => instanceHue(this.instanceId()));
  protected readonly widthLabel = computed(() => {
    const width = this.initialWidth();
    return width === null ? 'pendiente' : `${width} px`;
  });
  protected readonly labelledBy = computed(() => this.title()?.id ?? null);

  constructor() {
    // Medir exige layout real, así que se hace tras el render y en la fase `read`.
    // Es el único uso justificado de ElementRef: leer una geometría que no existe como binding.
    afterNextRender({
      read: () => {
        const element = this.surface()?.nativeElement;
        if (!element) {
          return;
        }

        const width = Math.round(element.getBoundingClientRect().width);
        this.measuredWidth.set(width);
        this.record('afterNextRender', `ancho inicial medido: ${width}px`);
      },
    });

    inject(DestroyRef).onDestroy(() =>
      this.record('DestroyRef.onDestroy', 'callback registrado con DestroyRef'),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.knownInstanceId = this.instanceId();
    for (const [name, change] of Object.entries(changes)) {
      const origin = change.firstChange ? 'valor inicial' : `${change.previousValue}`;
      this.record('ngOnChanges', `${name}: ${origin} → ${change.currentValue}`);
    }
  }

  ngOnInit(): void {
    this.record('ngOnInit', `inputs disponibles: density=${this.density()}`);
  }

  ngAfterContentInit(): void {
    this.record(
      'ngAfterContentInit',
      `contentChild(título): ${this.hasTitle() ? 'encontrado' : 'undefined'}`,
    );
  }

  ngAfterViewInit(): void {
    this.record(
      'ngAfterViewInit',
      `viewChild('surface'): ${this.hasSurface() ? 'encontrado' : 'undefined'}`,
    );
  }

  ngOnDestroy(): void {
    this.record('ngOnDestroy', 'el panel se retira de la vista');
  }

  private record(hook: LifecycleHook, detail: string): void {
    // Un input requerido no se puede leer si el panel se destruye antes de recibir su primer valor.
    if (this.knownInstanceId !== null) {
      this.log?.record({ instanceId: this.knownInstanceId, hook, detail });
    }
  }
}
