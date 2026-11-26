import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ReadingCounter } from '../shared/reading-counter';

@Component({
  selector: 'app-eager-counter',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: '../shared/reading-counter.html',
  styleUrls: ['../../shared/lab-controls.scss', '../shared/reading-counter.scss'],
})
export class EagerCounter extends ReadingCounter {
  protected readonly strategy = 'Hijo Eager';
  protected readonly strategyHint = 'Explícito';
  private readonly metric = viewChild.required<ElementRef<HTMLElement>>('metric');

  constructor() {
    super();
    afterEveryRender(() => this.displayEvaluations(this.metric()));
  }
}
