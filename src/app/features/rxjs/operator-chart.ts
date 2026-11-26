import { Component, computed, input } from '@angular/core';
import { OperationEvent, operations } from './operator-comparison';

export interface TimedOperationEvent extends OperationEvent {
  readonly elapsed: number;
}

@Component({
  selector: 'app-rxjs-operator-chart',
  styleUrl: './rxjs-chart.scss',
  template: `
    <div class="chart" aria-hidden="true">
      @for (lane of lanes(); track lane.name) {
        <div class="chart-row">
          <span>{{ lane.name }}</span>
          <div class="track">
            @if (lane.started !== undefined) {
              <span
                class="bar"
                [class.cancelled]="lane.state === 'cancelado'"
                [class.finished]="lane.state === 'finalizado'"
                [style.left.%]="position(lane.started)"
                [style.width.%]="position((lane.ended ?? elapsed()) - lane.started)"
              ></span>
            }
            @if (lane.received !== undefined) {
              <span class="marker arrival" [style.left.%]="position(lane.received)"></span>
            }
            @if (lane.ended !== undefined) {
              <span class="marker outcome" [style.left.%]="position(lane.ended)">
                {{ lane.symbol }}
              </span>
            }
          </div>
        </div>
      }
      <div class="chart-row">
        <span></span>
        <div class="axis">
          <span>0 s</span><span>{{ horizon() / 1000 }} s</span>
        </div>
      </div>
    </div>
  `,
})
export class OperatorChart {
  readonly events = input.required<readonly TimedOperationEvent[]>();
  readonly elapsed = input.required<number>();
  readonly horizon = input.required<number>();

  protected readonly lanes = computed(() =>
    operations.map(({ name }) => {
      const events = this.events().filter((event) => event.name === name);
      const terminal = events.find(
        ({ kind }) => kind === 'cancelado' || kind === 'ignorado' || kind === 'finalizado',
      );
      return {
        name,
        received: events.find(({ kind }) => kind === 'recibido')?.elapsed,
        started: events.find(({ kind }) => kind === 'iniciado')?.elapsed,
        ended: terminal?.elapsed,
        state: terminal?.kind,
        symbol: terminal?.kind === 'finalizado' ? '✓' : terminal?.kind === 'ignorado' ? '–' : '×',
      };
    }),
  );

  protected position(time: number): number {
    return Math.max(0, Math.min(100, (time / this.horizon()) * 100));
  }
}
