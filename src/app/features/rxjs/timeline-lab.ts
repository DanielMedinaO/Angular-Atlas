import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  interval,
  scan,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  throwError,
} from 'rxjs';

@Component({
  selector: 'app-rxjs-timeline',
  styleUrls: ['./rxjs-lab.scss', './emission-chart.scss'],
  template: `
    <div class="lab">
      <div class="console">
        <div class="toolbar">
          <h3>Control del flujo</h3>
          <span class="tag">600 ms por emisión</span>
        </div>
        <div class="actions timeline-actions">
          <button class="primary" (click)="start()" [attr.aria-disabled]="active()">
            <span aria-hidden="true">▶</span> Iniciar flujo
          </button>
          <button (click)="pauseOrResume()" [attr.aria-disabled]="!active()">
            {{ paused() ? 'Reanudar' : 'Pausar' }}
          </button>
          <button (click)="finish()" [attr.aria-disabled]="!active()">Completar</button>
          <button (click)="fail()" [attr.aria-disabled]="!active()">Simular error</button>
          <button (click)="cancel()" [attr.aria-disabled]="!active()">Cancelar suscripción</button>
        </div>
        <p class="readout" role="status">{{ status() }}</p>
      </div>
      <figure class="panel emission-chart">
        <figcaption>
          <strong>Emisiones acumuladas</strong>
          <span
            >Cada escalón representa un <code>next()</code>. Pausa y reanuda para ver el tramo
            horizontal.</span
          >
        </figcaption>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="100" x2="100" y2="100" />
          <line x1="0" y1="0" x2="0" y2="100" />
          <polyline [attr.points]="steps()" />
        </svg>
        <div class="emission-axis" aria-hidden="true">
          <span>0 s</span><span>{{ horizon() / 1000 }} s</span>
        </div>
      </figure>
      <div role="log" aria-label="Notificaciones del flujo">
        <ol class="timeline" role="list">
          @for (entry of entries(); track $index) {
            <li>
              {{ entry }} <span>{{ timestamps()[$index] }} ms</span>
            </li>
          }
        </ol>
      </div>
    </div>
  `,
})
export class TimelineLab {
  private readonly mode = new BehaviorSubject<'running' | 'paused' | 'error'>('running');
  private readonly completion = new Subject<void>();
  private subscription?: Subscription;
  private startedAt = 0;
  private readonly elapsed = signal(0);
  protected readonly timestamps = signal<number[]>([]);
  protected readonly horizon = computed(() =>
    Math.max(8000, Math.ceil(this.elapsed() / 1000) * 1000),
  );
  protected readonly steps = computed(() => {
    const scale = (time: number) => (time / this.horizon()) * 100;
    const points = ['0,100'];
    let height = 100;
    for (const [index, entry] of this.entries().entries()) {
      if (!entry.startsWith('next(')) break;
      const x = scale(this.timestamps()[index]);
      points.push(`${x},${height}`);
      height = 100 - ((index + 1) / 12) * 100;
      points.push(`${x},${height}`);
    }
    points.push(`${scale(this.elapsed())},${height}`);
    return points.join(' ');
  });

  protected readonly active = signal(false);
  protected readonly paused = signal(false);
  protected readonly status = signal('Listo para iniciar');
  protected readonly entries = signal<string[]>([]);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  start(): void {
    if (this.active()) return;
    this.entries.set([]);
    this.timestamps.set([]);
    this.elapsed.set(0);
    this.startedAt = performance.now();
    this.status.set('En ejecución · una emisión cada 600 ms');
    this.paused.set(false);
    this.mode.next('running');
    this.active.set(true);
    this.subscription = this.mode
      .pipe(
        switchMap((mode) => {
          if (mode === 'error') return throwError(() => new Error('Error simulado'));
          return mode === 'paused' ? EMPTY : interval(600);
        }),
        scan((count) => count + 1, 0),
        take(12),
        takeUntil(this.completion),
      )
      .subscribe({
        next: (value) => this.record(`next(${value})`),
        complete: () => this.stop('complete · flujo completado'),
        error: (error: Error) => this.stop(`error · ${error.message}`),
      });
    this.subscription.add(interval(80).subscribe(() => this.elapsed.set(this.measure())));
  }

  pauseOrResume(): void {
    if (!this.active()) return;
    this.paused.update((paused) => !paused);
    this.mode.next(this.paused() ? 'paused' : 'running');
    this.status.set(this.paused() ? 'En pausa' : 'En ejecución');
  }

  finish(): void {
    if (this.active()) this.completion.next();
  }

  fail(): void {
    if (this.active()) this.mode.next('error');
  }

  cancel(): void {
    if (!this.active()) return;
    this.subscription?.unsubscribe();
    this.stop('unsubscribe · suscripción cancelada');
  }

  private record(entry: string): void {
    const time = this.measure();
    this.elapsed.set(time);
    this.timestamps.update((timestamps) => [...timestamps, time]);
    this.entries.update((entries) => [...entries, entry]);
  }

  private measure(): number {
    return Math.round(performance.now() - this.startedAt);
  }

  private stop(status: string): void {
    this.record(status);
    this.status.set(status);
    this.active.set(false);
    this.paused.set(false);
  }
}
