import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { instanceHue, LifecycleLog } from '../lifecycle-log';
import { PanelDensity, ReadingPanel } from '../reading-panel/reading-panel';
import { ReadingPanelTitle } from '../reading-panel/reading-panel-title';

export interface QueryResult {
  readonly label: string;
  readonly value: string;
  readonly found: boolean;
}

@Component({
  selector: 'app-lifecycle-lab',
  imports: [ReadingPanel, ReadingPanelTitle],
  // El registro vive solo con este laboratorio: sobrevive al panel hijo, pero no es global.
  providers: [LifecycleLog],
  templateUrl: './lifecycle-lab.html',
  styleUrl: './lifecycle-lab.scss',
})
export class LifecycleLab {
  private readonly log = inject(LifecycleLog);
  private nextInstanceId = 1;

  // El padre decide si el panel existe y qué contenido proyecta; @if vive aquí, no en el hijo.
  protected readonly activeInstanceId = signal<number | null>(null);
  protected readonly showTitle = signal(true);
  protected readonly density = signal<PanelDensity>('comfortable');

  // Consulta de vista del PADRE sobre un componente hijo: undefined mientras el @if lo oculta.
  protected readonly panel = viewChild(ReadingPanel);

  protected readonly entries = this.log.entries;

  protected readonly queryResults = computed<readonly QueryResult[]>(() => {
    const panel = this.panel();
    const width = panel?.initialWidth();

    return [
      {
        label: 'viewChild(ReadingPanel) en el laboratorio',
        // La consulta ya devuelve la instancia, pero sus inputs requeridos pueden no estar asignados
        // todavía; por eso el id se toma del estado del laboratorio y no de panel.instanceId().
        value: panel ? `ReadingPanel #${this.activeInstanceId()}` : 'undefined',
        found: panel !== undefined,
      },
      {
        label: "viewChild('surface') dentro del panel",
        value: panel?.hasSurface() ? '<section> encontrado' : 'undefined',
        found: panel?.hasSurface() ?? false,
      },
      {
        label: 'contentChild(ReadingPanelTitle) en el panel',
        value: panel?.hasTitle() ? 'ReadingPanelTitle encontrado' : 'undefined',
        found: panel?.hasTitle() ?? false,
      },
      {
        label: 'Ancho inicial (afterNextRender)',
        value: !panel ? '—' : width == null ? 'pendiente' : `${width} px`,
        found: width != null,
      },
    ];
  });

  protected hue(instanceId: number): number {
    return instanceHue(instanceId);
  }

  protected createPanel(): void {
    this.activeInstanceId.set(this.nextInstanceId++);
  }

  protected destroyPanel(): void {
    this.activeInstanceId.set(null);
  }

  protected toggleTitle(): void {
    this.showTitle.update((visible) => !visible);
  }

  protected toggleDensity(): void {
    this.density.update((current) => (current === 'compact' ? 'comfortable' : 'compact'));
  }

  protected clearLog(): void {
    this.log.clear();
  }
}
