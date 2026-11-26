import { Component } from '@angular/core';
import { AngularLab } from './angular-lab';
import { CommonLab } from './common-lab';
import { OperatorLab } from './operator-lab';
import { SubjectLab } from './subject-lab';
import { TimelineLab } from './timeline-lab';

@Component({
  selector: 'app-rxjs-page',
  imports: [TimelineLab, SubjectLab, OperatorLab, CommonLab, AngularLab],
  templateUrl: './rxjs-page.html',
  styleUrl: './rxjs-page.scss',
})
export class RxjsPage {
  protected readonly creation = `import { Observable, filter, from, fromEvent, interval, map, of, take } from 'rxjs';

const custom$ = new Observable<number>(observer => {
  const timer = setTimeout(() => {
    observer.next(42);
    observer.complete();
  }, 500);
  return () => clearTimeout(timer);
});

const subscription = custom$.subscribe({
  next: value => console.log(value),
  error: error => console.error(error),
  complete: () => console.log('Completado'),
});

const values$ = of(1, 2, 3).pipe(filter(n => n > 1), map(n => n * 10));
const letters$ = from(['a', 'b']);
const ticks$ = interval(1000).pipe(take(3));
const clicks$ = fromEvent(button, 'click');

// Si ya no necesitas la operación:
subscription.unsubscribe();`;
}
