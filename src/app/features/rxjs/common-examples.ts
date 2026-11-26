import {
  catchError,
  combineLatest,
  concat,
  debounceTime,
  defer,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  map,
  merge,
  Observable,
  of,
  retry,
  shareReplay,
  tap,
} from 'rxjs';

type Log = (message: string) => void;
type Example = (log: Log) => Observable<string | number>;

export function searchTerms(terms: Observable<string>): Observable<string> {
  return terms.pipe(
    map((term) => term.trim()),
    debounceTime(350),
    distinctUntilChanged(),
  );
}

export function retryExample(log: Log): Observable<string> {
  return defer(() => {
    let attempts = 0;
    return defer(() => {
      log(`Intento ${++attempts}`);
      if (attempts < 3) throw new Error('Fallo transitorio');
      return of('Éxito en el tercer intento');
    }).pipe(retry(2));
  });
}

export const examples: readonly {
  name: string;
  description: string;
  code: string;
  run: Example;
}[] = [
  {
    name: 'map',
    description: 'Transforma cada valor. Por ejemplo, calcula precios con impuestos.',
    code: 'of(10, 20, 30).pipe(map(price => price * 1.2))',
    run: () => of(10, 20, 30).pipe(map((price) => price * 1.2)),
  },
  {
    name: 'filter',
    description:
      'Deja pasar valores que cumplen una condición. Por ejemplo, descarta cantidades sin stock.',
    code: 'of(0, 2, 0, 5).pipe(filter(stock => stock > 0))',
    run: () => of(0, 2, 0, 5).pipe(filter((stock) => stock > 0)),
  },
  {
    name: 'tap',
    description: 'Ejecuta un efecto lateral, como registrar una respuesta, y conserva su valor.',
    code: 'of(10, 20).pipe(tap(value => log(value)))',
    run: (log) => of(10, 20).pipe(tap((value) => log(`tap observó ${value}`))),
  },
  {
    name: 'combineLatest',
    description:
      'Combina los valores más recientes después de que cada fuente emite al menos una vez. Úsalo para combinar filtros activos.',
    code: "combineLatest([merge(of('Todos'), of('Angular').pipe(delay(450))), of('Por título')])",
    run: () =>
      combineLatest([merge(of('Todos'), of('Angular').pipe(delay(450))), of('Por título')]).pipe(
        map((values) => values.join(' · ')),
      ),
  },
  {
    name: 'forkJoin',
    description:
      'Cuando todas las fuentes completan y cada una ha emitido, entrega sus últimos valores juntos. Úsalo para cargar datos independientes de una vista.',
    code: "forkJoin([of('Libros').pipe(delay(250)), of('Autores').pipe(delay(500))])",
    run: () =>
      forkJoin([of('Libros').pipe(delay(250)), of('Autores').pipe(delay(500))]).pipe(
        map((values) => values.join(' · ')),
      ),
  },
  {
    name: 'catchError',
    description:
      'Reemplaza un flujo que falla. Por ejemplo, muestra datos de respaldo si falla una consulta.',
    code: "defer(() => { throw new Error('Catálogo inaccesible'); }).pipe(catchError(() => of('Catálogo local')))",
    run: (log) =>
      defer(() => {
        throw new Error('Catálogo inaccesible');
      }).pipe(
        catchError((error: Error) => {
          log(`Error capturado · ${error.message}`);
          return of('Catálogo local');
        }),
      ),
  },
  {
    name: 'retry',
    description:
      'Vuelve a suscribirse cuando la fuente falla. Dos reintentos permiten hasta tres intentos en total.',
    code: 'fuenteQueFallaDosVeces$.pipe(retry(2))',
    run: retryExample,
  },
  {
    name: 'finalize',
    description:
      'Ejecuta limpieza al completar, fallar o cancelar. Inicia este ejemplo y pulsa Detener antes de que emita.',
    code: "of('Respuesta').pipe(delay(1500), finalize(() => log('Recurso liberado')))",
    run: (log) =>
      of('Respuesta').pipe(
        delay(1500),
        finalize(() => log('Recurso liberado')),
      ),
  },
  {
    name: 'shareReplay',
    description:
      'Comparte la suscripción y entrega valores recientes a suscriptores tardíos. Aquí el segundo lector recibe el valor almacenado tras completar la fuente.',
    code: 'fuente$.pipe(shareReplay({ bufferSize: 1, refCount: true }))',
    run: (log) => {
      const shared = defer(() => {
        log('Fuente ejecutada');
        return of('Catálogo');
      }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
      return concat(
        shared.pipe(map((value) => `Lector 1 · ${value}`)),
        shared.pipe(map((value) => `Lector 2 tardío · ${value}`)),
      );
    },
  },
];
