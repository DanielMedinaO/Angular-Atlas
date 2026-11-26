import {
  concatMap,
  defer,
  exhaustMap,
  finalize,
  map,
  merge,
  mergeMap,
  Observable,
  switchMap,
  tap,
  timer,
} from 'rxjs';

export const operatorNames = ['switchMap', 'concatMap', 'mergeMap', 'exhaustMap'] as const;
export type OperatorName = (typeof operatorNames)[number];

export const operations = [
  { name: 'A', duration: 900 },
  { name: 'B', duration: 650 },
  { name: 'C', duration: 180 },
] as const;
type Operation = (typeof operations)[number];
type OperationName = Operation['name'];
const operators = {
  switchMap: switchMap<Operation, Observable<OperationName>>,
  concatMap: concatMap<Operation, Observable<OperationName>>,
  mergeMap: mergeMap<Operation, Observable<OperationName>>,
  exhaustMap: exhaustMap<Operation, Observable<OperationName>>,
};
type EventKind = 'recibido' | 'iniciado' | 'cancelado' | 'ignorado' | 'resultado' | 'finalizado';
export interface OperationEvent {
  readonly name: Operation['name'];
  readonly kind: EventKind;
}

export function operationEvents(waitB: number, waitC: number): Observable<Operation> {
  const [a, b, c] = operations;
  return merge(
    timer(0).pipe(map(() => a)),
    timer(waitB).pipe(map(() => b)),
    timer(waitB + waitC).pipe(map(() => c)),
  );
}

export function compareOperator(
  operator: OperatorName,
  events: Observable<Operation>,
  log: (event: OperationEvent) => void,
): Observable<Operation['name']> {
  return defer(() => {
    let innerActive = false;
    return events.pipe(
      tap(({ name }) => {
        log({ name, kind: 'recibido' });
        if (operator === 'exhaustMap' && innerActive) log({ name, kind: 'ignorado' });
      }),
      operators[operator](({ name, duration }) =>
        defer(() => {
          let completed = false;
          innerActive = true;
          log({ name, kind: 'iniciado' });
          return timer(duration).pipe(
            map(() => name),
            tap({
              next: () => log({ name, kind: 'resultado' }),
              complete: () => {
                completed = true;
                innerActive = false;
                log({ name, kind: 'finalizado' });
              },
            }),
            finalize(() => {
              if (!completed) log({ name, kind: 'cancelado' });
            }),
          );
        }),
      ),
    );
  });
}
