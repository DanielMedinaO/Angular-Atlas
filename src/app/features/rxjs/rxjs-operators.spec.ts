import { TestScheduler } from 'rxjs/testing';
import { examples, retryExample, searchTerms } from './common-examples';
import {
  compareOperator,
  operationEvents,
  OperationEvent,
  OperatorName,
} from './operator-comparison';

describe('RxJS operators', () => {
  function scheduler(): TestScheduler {
    return new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  }

  it.each([
    { operator: 'switchMap', results: ['C'], cancelled: ['A', 'B'], ignored: [] },
    { operator: 'concatMap', results: ['A', 'B', 'C'], cancelled: [], ignored: [] },
    { operator: 'mergeMap', results: ['C', 'B', 'A'], cancelled: [], ignored: [] },
    { operator: 'exhaustMap', results: ['A'], cancelled: [], ignored: ['B', 'C'] },
  ] as const)(
    'compara resultados y finalización con $operator',
    ({ operator, results, cancelled, ignored }) => {
      scheduler().run(({ flush }) => {
        const log: OperationEvent[] = [];
        const values: string[] = [];
        const complete = vi.fn();
        compareOperator(operator, operationEvents(200, 260), (entry) => log.push(entry)).subscribe({
          next: (value) => values.push(value),
          complete,
        });
        flush();

        const namesFor = (kind: OperationEvent['kind']) =>
          log.filter((entry) => entry.kind === kind).map((entry) => entry.name);
        expect(namesFor('recibido')).toEqual(['A', 'B', 'C']);
        expect(namesFor('resultado')).toEqual(results);
        expect(namesFor('finalizado')).toEqual(results);
        expect(namesFor('cancelado')).toEqual(cancelled);
        expect(namesFor('ignorado')).toEqual(ignored);
        expect(values).toEqual(results);
        expect(complete).toHaveBeenCalledOnce();
      });
    },
  );

  it('cancela una operación activa y evita recibir los eventos pendientes', () => {
    const clock = scheduler();
    clock.run(({ flush }) => {
      const log: OperationEvent[] = [];
      const next = vi.fn();
      const complete = vi.fn();
      const operator: OperatorName = 'mergeMap';
      const subscription = compareOperator(operator, operationEvents(200, 260), (event) =>
        log.push(event),
      ).subscribe({ next, complete });
      clock.schedule(() => subscription.unsubscribe(), 100);
      flush();
      expect(log).toEqual([
        { name: 'A', kind: 'recibido' },
        { name: 'A', kind: 'iniciado' },
        { name: 'A', kind: 'cancelado' },
      ]);
      expect(next).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });
  });

  it('espera 350 ms de silencio y deduplica consultas consecutivas', () => {
    scheduler().run(({ hot, expectObservable }) => {
      const source = hot('a 99ms b 399ms c 399ms d 499ms |', {
        a: 'A',
        b: 'Atlas',
        c: 'Atlas ',
        d: 'RxJS',
      });
      expectObservable(searchTerms(source)).toBe('450ms b 799ms d 149ms |', {
        b: 'Atlas',
        d: 'RxJS',
      });
    });
  });

  it('reintenta dos errores transitorios y emite el resultado del tercer intento', () => {
    const log = vi.fn();
    const next = vi.fn();
    const error = vi.fn();
    const complete = vi.fn();
    retryExample(log).subscribe({ next, error, complete });
    expect(log.mock.calls.flat()).toEqual(['Intento 1', 'Intento 2', 'Intento 3']);
    expect(next).toHaveBeenCalledExactlyOnceWith('Éxito en el tercer intento');
    expect(error).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledOnce();
  });

  it('captura el error y emite el respaldo', () => {
    const log = vi.fn();
    const next = vi.fn();
    examples
      .find(({ name }) => name === 'catchError')!
      .run(log)
      .subscribe(next);
    expect(log).toHaveBeenCalledWith('Error capturado · Catálogo inaccesible');
    expect(next).toHaveBeenCalledExactlyOnceWith('Catálogo local');
  });

  it('comparte una ejecución con el lector tardío', () => {
    const log = vi.fn();
    const values: (string | number)[] = [];
    examples
      .find(({ name }) => name === 'shareReplay')!
      .run(log)
      .subscribe((value) => values.push(value));
    expect(log).toHaveBeenCalledExactlyOnceWith('Fuente ejecutada');
    expect(values).toEqual(['Lector 1 · Catálogo', 'Lector 2 tardío · Catálogo']);
  });

  it('ejecuta finalize al cancelar antes del resultado', () => {
    scheduler().run(({ flush }) => {
      const log = vi.fn();
      const next = vi.fn();
      const sub = examples
        .find(({ name }) => name === 'finalize')!
        .run(log)
        .subscribe(next);
      sub.unsubscribe();
      flush();
      expect(log).toHaveBeenCalledExactlyOnceWith('Recurso liberado');
      expect(next).not.toHaveBeenCalled();
    });
  });
});
