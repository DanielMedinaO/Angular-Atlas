import { Component, DestroyRef, inject, signal } from '@angular/core';
import { finalize, interval, merge, share, Subscription } from 'rxjs';
import {
  compareOperator,
  operationEvents,
  OperatorName,
  operatorNames,
  operations,
} from './operator-comparison';
import { OperatorChart, TimedOperationEvent } from './operator-chart';

@Component({
  selector: 'app-rxjs-operators',
  imports: [OperatorChart],
  styleUrl: './operator-lab.scss',
  template: `
    <div class="lab">
      <div class="console">
        <div class="scenario">
          <h3>Configurar secuencia</h3>
          <dl class="durations" aria-label="Duración de cada operación">
            @for (op of operations; track op.name) {
              <div class="duration">
                <dt>{{ op.name }}</dt>
                <dd>{{ op.duration }} ms</dd>
              </div>
            }
          </dl>
        </div>
        <div class="intervals">
          <label>
            Tiempo de A a B
            <select #waitB>
              <option value="200">200 ms</option>
              <option value="600">600 ms</option>
              <option value="1100">1100 ms</option>
            </select>
          </label>
          <label>
            Tiempo de B a C
            <select #waitC>
              <option value="260">260 ms</option>
              <option value="700">700 ms</option>
              <option value="1200">1200 ms</option>
            </select>
          </label>
        </div>
        <div class="actions">
          <button
            class="primary"
            (click)="run(+waitB.value, +waitC.value)"
            [attr.aria-disabled]="running()"
          >
            <span aria-hidden="true">▶</span>
            Emitir A, B y C
          </button>
          <button (click)="cancel()" [attr.aria-disabled]="!running()">
            <span aria-hidden="true">■</span>
            Detener comparación
          </button>
          <button (click)="reset()">
            <span aria-hidden="true">↺</span>
            Reiniciar gráficas
          </button>
        </div>
      </div>
      <div class="readout">
        <p class="status" role="status" [class.running]="running()">{{ status() }}</p>
        <ul class="legend" role="list" aria-label="Leyenda de las gráficas">
          <li><span aria-hidden="true">○</span> Llegada</li>
          <li><span class="legend-bar" aria-hidden="true"></span> En ejecución</li>
          <li><span aria-hidden="true">✓</span> Resultado</li>
          <li><span aria-hidden="true">×</span> Cancelación</li>
          <li><span aria-hidden="true">–</span> Ignorado</li>
        </ul>
        <p>
          Lee de izquierda a derecha. El espacio entre la llegada y el inicio de la barra indica
          espera en cola.
        </p>
      </div>
      <div class="grid">
        @for (operator of names; track operator) {
          <div class="panel">
            <header>
              <h3>
                <code>{{ operator }}</code>
              </h3>
              <p>{{ descriptions[operator] }}</p>
            </header>
            <app-rxjs-operator-chart
              [events]="logs()[operator] ?? []"
              [elapsed]="elapsed()"
              [horizon]="horizon()"
            />
            <ol [attr.aria-label]="'Eventos de ' + operator">
              @for (entry of logs()[operator] ?? []; track $index) {
                <li>
                  <span>{{ entry.name }} · {{ entry.kind }}</span>
                  <time [attr.datetime]="'PT' + entry.elapsed / 1000 + 'S'"
                    >{{ entry.elapsed }} ms</time
                  >
                </li>
              }
            </ol>
          </div>
        }
      </div>
    </div>
  `,
})
export class OperatorLab {
  private runSubscription?: Subscription;
  protected readonly names = operatorNames;
  protected readonly operations = operations;
  protected readonly descriptions = {
    switchMap: 'Reemplaza la operación activa al llegar otro evento.',
    concatMap: 'Encola eventos y ejecuta una operación a la vez.',
    mergeMap: 'Ejecuta operaciones en paralelo.',
    exhaustMap: 'Ignora eventos mientras una operación está activa.',
  };
  protected readonly logs = signal<Partial<Record<OperatorName, TimedOperationEvent[]>>>({});
  protected readonly elapsed = signal(0);
  protected readonly horizon = signal(2000);
  protected readonly running = signal(false);
  protected readonly status = signal('Listo para comparar.');

  constructor() {
    inject(DestroyRef).onDestroy(() => this.runSubscription?.unsubscribe());
  }

  run(waitB: number, waitC: number): void {
    if (this.running()) return;
    this.logs.set({});
    this.elapsed.set(0);
    const [a, b, c] = this.operations;
    const lastFinish =
      Math.max(Math.max(a.duration, waitB) + b.duration, waitB + waitC) + c.duration;
    this.horizon.set(Math.ceil(lastFinish / 1000) * 1000);
    const start = performance.now();
    const measure = () => Math.round(performance.now() - start);
    this.running.set(true);
    this.status.set('Comparación en curso.');
    const events = operationEvents(waitB, waitC).pipe(share());
    this.runSubscription = merge(
      ...this.names.map((name) =>
        compareOperator(name, events, (entry) => {
          const elapsed = measure();
          this.elapsed.set(elapsed);
          this.logs.update((logs) => ({
            ...logs,
            [name]: [...(logs[name] ?? []), { ...entry, elapsed }],
          }));
        }),
      ),
    )
      .pipe(finalize(() => this.running.set(false)))
      .subscribe({
        complete: () => this.status.set('Comparación completada.'),
      });
    this.runSubscription.add(interval(40).subscribe(() => this.elapsed.set(measure())));
  }

  reset(): void {
    this.runSubscription?.unsubscribe();
    this.logs.set({});
    this.elapsed.set(0);
    this.status.set('Gráficas reiniciadas. Listo para comparar.');
  }

  cancel(): void {
    if (!this.running()) return;
    this.runSubscription?.unsubscribe();
    this.status.set('Comparación detenida. Se descartaron los eventos pendientes.');
  }
}
