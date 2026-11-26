import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, delay, interval, map, Observable, of, scan } from 'rxjs';

@Component({
  selector: 'app-rxjs-clock',
  styleUrl: './rxjs-lab.scss',
  template: '<p class="clock-output">Emisiones desde que se montó el reloj · {{ ticks() }}</p>',
})
export class RxjsClock {
  protected readonly ticks = signal(0);

  constructor() {
    interval(500)
      .pipe(takeUntilDestroyed())
      .subscribe((tick) => this.ticks.set(tick + 1));
  }
}

@Component({
  selector: 'app-rxjs-angular',
  imports: [AsyncPipe, RouterLink, RxjsClock],
  styleUrl: './rxjs-lab.scss',
  template: `
    <div class="lab interop">
      <div class="console bridge">
        <h3>async pipe, toSignal() y toObservable()</h3>
        <p>
          <code>async</code> suscribe la vista al Observable y la desvincula al destruirla.
          <code>toSignal()</code> expone el último valor del Observable como un Signal y gestiona la
          suscripción durante la vida del componente.
        </p>
        <p>
          <code>toObservable()</code> observa el Signal mediante un efecto. Angular puede agrupar
          cambios rápidos durante la estabilización: tres llamadas síncronas a
          <code>set()</code> pueden producir una sola emisión con el último valor.
        </p>
        <div class="actions">
          <button class="primary" (click)="value.update(increment)">Incrementar</button>
          <button (click)="burst()">Ejecutar tres set() seguidos</button>
        </div>
        <dl class="metrics">
          <div>
            <dt>Signal original</dt>
            <dd>{{ value() }}</dd>
          </div>
          <div>
            <dt>Última emisión como Signal</dt>
            <dd>{{ latest() }}</dd>
          </div>
        </dl>
        <p class="readout" role="status">
          Historial con async · {{ (history$ | async)?.join(' → ') }}
        </p>
      </div>
      <div class="panel">
        <h3>takeUntilDestroyed()</h3>
        <p>
          El reloj se suscribe explícitamente para demostrar cómo
          <code>takeUntilDestroyed()</code> termina el flujo al retirar el componente. Vuelve a
          montarlo para iniciar desde cero.
        </p>
        <button class="primary" (click)="clockVisible.set(!clockVisible())">
          {{ clockVisible() ? 'Retirar reloj' : 'Montar reloj' }}
        </button>
        @if (clockVisible()) {
          <app-rxjs-clock />
        }
      </div>
      <div class="panel">
        <h3>rxResource()</h3>
        <p>
          Convierte un Observable dependiente de parámetros en un recurso con Signals de carga,
          error y valor. Cambiar el parámetro cancela la carga anterior.
        </p>
        <button class="primary" (click)="resourceId.update(increment)">
          {{ resourceId() ? 'Cargar otro recurso' : 'Cargar recurso' }}
        </button>
        <p class="readout" role="status">
          @if (resource.isLoading()) {
            Cargando ficha {{ resourceId() }}…
          } @else if (resource.error()) {
            Error al cargar la ficha.
          } @else {
            {{ resource.value() ?? 'Sin carga iniciada' }}
          }
        </p>
      </div>
      <div class="panel">
        <h3>HttpClient</h3>
        <p>
          <code>HttpClient.get()</code> devuelve un Observable frío. Aquí <code>async</code> inicia
          la petición a un archivo local al pulsar el botón. El flujo emite la respuesta y completa,
          o entrega un error que capturamos con <code>catchError()</code>.
        </p>
        <button class="primary" (click)="load()">Solicitar ficha local</button>
        <p class="readout" role="status">
          {{ (response$() | async) ?? (response$() ? 'Cargando…' : 'Sin petición') }}
        </p>
        <p>
          Profundiza en <a routerLink="/http" fragment="rxjs-lab-title">HttpClient y RxJS</a> con el
          laboratorio de búsquedas y cancelación de peticiones.
        </p>
      </div>
    </div>
  `,
})
export class AngularLab {
  private readonly http = inject(HttpClient);
  protected readonly value = signal(0);
  private readonly value$ = toObservable(this.value);
  protected readonly latest = toSignal(this.value$, { initialValue: 0 });
  protected readonly history$ = this.value$.pipe(
    scan((history, value) => [...history.slice(-7), value], [] as number[]),
  );
  protected readonly clockVisible = signal(false);
  protected readonly resourceId = signal(0);
  protected readonly resource = rxResource({
    params: () => this.resourceId() || undefined,
    stream: ({ params }) => of(`Ficha ${params} cargada`).pipe(delay(400)),
  });
  protected readonly response$ = signal<Observable<string> | null>(null);
  protected readonly increment = (value: number) => value + 1;

  burst(): void {
    const value = this.value();
    this.value.set(value + 1);
    this.value.set(value + 2);
    this.value.set(value + 3);
  }

  load(): void {
    this.response$.set(
      this.http.get<{ lesson: string }>('atlas-data/rxjs.json').pipe(
        map(({ lesson }) => lesson),
        catchError(() => of('No se pudo cargar la ficha local.')),
      ),
    );
  }
}
