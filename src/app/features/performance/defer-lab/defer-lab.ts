import { Component, signal } from '@angular/core';
import { DeferredChartState } from './deferred-chart-state/deferred-chart-state';
import { ReadingChart } from './reading-chart/reading-chart';

@Component({
  selector: 'app-performance-defer-lab',
  imports: [DeferredChartState, ReadingChart],
  styleUrls: ['../shared/lab-controls.scss', './defer-lab.scss'],
  template: `
    <div class="lab">
      <div class="toolbar">
        <div class="scenario">
          <label for="performance-defer-scenario">Escenario de carga</label>
          <select
            #scenario
            id="performance-defer-scenario"
            [value]="prefetch() ? 'idle' : 'interaction'"
            (change)="prefetch.set(scenario.value === 'idle')"
          >
            <option value="interaction">Interacción</option>
            <option value="idle">Interacción con prefetch en idle</option>
          </select>
        </div>
        <button #showChart class="primary" type="button" aria-controls="performance-chart-output">
          Mostrar gráfico
        </button>
      </div>

      <div class="stage" id="performance-chart-output" aria-live="polite">
        @if (prefetch()) {
          @defer (on interaction(showChart); prefetch on idle) {
            <app-performance-reading-chart />
          } @placeholder {
            <app-deferred-chart-state state="pending" [prefetch]="prefetch()" />
          } @loading {
            <app-deferred-chart-state state="loading" />
          } @error {
            <app-deferred-chart-state state="error" />
          }
        } @else {
          @defer (on interaction(showChart)) {
            <app-performance-reading-chart />
          } @placeholder {
            <app-deferred-chart-state state="pending" />
          } @loading {
            <app-deferred-chart-state state="loading" />
          } @error {
            <app-deferred-chart-state state="error" />
          }
        }
      </div>
    </div>
  `,
})
export class DeferLab {
  protected readonly prefetch = signal(false);
}
