import { afterEveryRender, Component, ElementRef, signal, viewChild } from '@angular/core';
import { EagerCounter } from './eager-counter/eager-counter';
import { OnPushCounter } from './on-push-counter/on-push-counter';
import { EvaluationProbe } from './shared/reading-counter';

@Component({
  selector: 'app-change-detection-lab',
  imports: [OnPushCounter, EagerCounter],
  template: `
    {{ recordEvaluation() }}
    <div class="parent-panel">
      <div>
        <h3>Componente padre</h3>
        <dl class="parent-metrics">
          <div>
            <dt>Actualizaciones solicitadas</dt>
            <dd>{{ rounds() }}</dd>
          </div>
          <div>
            <dt>Evaluaciones de plantilla</dt>
            <dd #metric></dd>
          </div>
        </dl>
      </div>
      <button class="primary" type="button" (click)="rounds.update((count) => count + 1)">
        Actualizar el padre
      </button>
    </div>
    <div class="columns children">
      <app-on-push-counter />
      <app-eager-counter class="eager" />
    </div>
  `,
  styleUrls: [
    '../shared/lab-columns.scss',
    '../shared/lab-controls.scss',
    './change-detection-lab.scss',
  ],
})
export class ChangeDetectionLab extends EvaluationProbe {
  protected readonly rounds = signal(0);
  private readonly metric = viewChild.required<ElementRef<HTMLElement>>('metric');

  constructor() {
    super();
    afterEveryRender(() => this.displayEvaluations(this.metric()));
  }
}
