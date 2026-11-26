import { afterEveryRender, Component, ElementRef, viewChild } from '@angular/core';
import { ReadingCounter } from '../shared/reading-counter';

@Component({
  selector: 'app-on-push-counter',
  templateUrl: '../shared/reading-counter.html',
  styleUrls: ['../../shared/lab-controls.scss', '../shared/reading-counter.scss'],
})
export class OnPushCounter extends ReadingCounter {
  protected readonly strategy = 'Hijo OnPush';
  protected readonly strategyHint = 'Predeterminado';
  private readonly metric = viewChild.required<ElementRef<HTMLElement>>('metric');

  constructor() {
    super();
    afterEveryRender(() => this.displayEvaluations(this.metric()));
  }
}
