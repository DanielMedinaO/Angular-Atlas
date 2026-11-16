import { Component } from '@angular/core';
import { LifecycleLab } from './lifecycle-lab/lifecycle-lab';
import {
  AFTER_NEXT_RENDER_SNIPPET,
  CHECKED_HOOKS_SNIPPET,
  CONSTRUCTOR_VS_ONINIT_SNIPPET,
  CONTENT_QUERIES_SNIPPET,
  CONTENT_VIEW_HOOKS_SNIPPET,
  DESTROY_SNIPPET,
  LEGACY_QUERIES_SNIPPET,
  LIFECYCLE_LOG_SNIPPET,
  ON_CHANGES_SNIPPET,
  PROJECTION_SNIPPET,
  VIEW_QUERIES_SNIPPET,
} from './components-page.snippets';

export interface LifecycleRow {
  readonly hook: string;
  readonly when: string;
  readonly frequency: string;
  readonly use: string;
}

const LIFECYCLE_ROWS: readonly LifecycleRow[] = [
  {
    hook: 'constructor',
    when: 'Al instanciar la clase, antes de asignar inputs.',
    frequency: 'Una vez',
    use: 'Inyectar dependencias, declarar signals, queries y callbacks de render o destrucción.',
  },
  {
    hook: 'ngOnChanges',
    when: 'Antes de ngOnInit y cada vez que cambia un input enlazado.',
    frequency: 'Cada cambio de input',
    use: 'Comparar valores anterior y actual (SimpleChanges).',
  },
  {
    hook: 'ngOnInit',
    when: 'Tras los primeros inputs.',
    frequency: 'Una vez',
    use: 'Inicialización que depende de los inputs.',
  },
  {
    hook: 'ngAfterContentInit',
    when: 'Cuando el contenido proyectado ya se inicializó.',
    frequency: 'Una vez',
    use: 'Leer contentChild() y contentChildren().',
  },
  {
    hook: 'ngAfterContentChecked',
    when: 'Tras comprobar el contenido proyectado.',
    frequency: 'Cada ciclo de detección',
    use: 'Casi nunca; evita trabajo costoso.',
  },
  {
    hook: 'ngAfterViewInit',
    when: 'Cuando la vista del componente y sus hijos se inicializaron.',
    frequency: 'Una vez',
    use: 'Leer viewChild() y viewChildren().',
  },
  {
    hook: 'ngAfterViewChecked',
    when: 'Tras comprobar la vista del componente.',
    frequency: 'Cada ciclo de detección',
    use: 'Casi nunca; evita trabajo costoso.',
  },
  {
    hook: 'afterNextRender',
    when: 'Tras el siguiente render del DOM, solo en el navegador.',
    frequency: 'Una vez',
    use: 'Medir layout, integrar librerías que necesitan el DOM.',
  },
  {
    hook: 'ngOnDestroy / DestroyRef',
    when: 'Justo antes de retirar el componente.',
    frequency: 'Una vez',
    use: 'Liberar timers, listeners y recursos externos.',
  },
];

@Component({
  selector: 'app-components-page',
  imports: [LifecycleLab],
  templateUrl: './components-page.html',
  styleUrl: './components-page.scss',
})
export class ComponentsPage {
  protected readonly lifecycleRows = LIFECYCLE_ROWS;
  protected readonly constructorVsOnInitSnippet = CONSTRUCTOR_VS_ONINIT_SNIPPET;
  protected readonly onChangesSnippet = ON_CHANGES_SNIPPET;
  protected readonly contentViewHooksSnippet = CONTENT_VIEW_HOOKS_SNIPPET;
  protected readonly checkedHooksSnippet = CHECKED_HOOKS_SNIPPET;
  protected readonly destroySnippet = DESTROY_SNIPPET;
  protected readonly viewQueriesSnippet = VIEW_QUERIES_SNIPPET;
  protected readonly contentQueriesSnippet = CONTENT_QUERIES_SNIPPET;
  protected readonly projectionSnippet = PROJECTION_SNIPPET;
  protected readonly afterNextRenderSnippet = AFTER_NEXT_RENDER_SNIPPET;
  protected readonly lifecycleLogSnippet = LIFECYCLE_LOG_SNIPPET;
  protected readonly legacyQueriesSnippet = LEGACY_QUERIES_SNIPPET;
}
