import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, Subscription } from 'rxjs';

const subjectTypes = ['Subject', 'BehaviorSubject', 'ReplaySubject'] as const;
type SubjectType = (typeof subjectTypes)[number];

interface Listener {
  readonly id: number;
  readonly active: boolean;
  readonly values: Record<SubjectType, readonly number[]>;
}

@Component({
  selector: 'app-rxjs-subjects',
  styleUrl: './subject-lab.scss',
  template: `
    <div class="lab">
      <div class="console">
        <div class="toolbar">
          <div class="next-value">
            <span>Próxima emisión</span>
            <strong>{{ nextValue() }}</strong>
          </div>
          <div class="actions">
            <button class="primary" (click)="emit()">
              <span aria-hidden="true">▶</span> Emitir {{ nextValue() }}
            </button>
            <button (click)="add()" [attr.aria-disabled]="listeners().length >= 8">
              <span aria-hidden="true">+</span> Agregar suscriptor
            </button>
            <button (click)="reset()"><span aria-hidden="true">↺</span> Reiniciar Subjects</button>
          </div>
        </div>
        <p class="status" role="status">{{ status() }}</p>
      </div>
      @if (listeners().length > 0) {
        <div class="subscribers">
          @for (listener of listeners(); track listener.id) {
            <div class="panel">
              <header>
                <div class="identity">
                  <h3>Suscriptor {{ listener.id }}</h3>
                  <span class="state" [class.active]="listener.active">
                    {{ listener.active ? 'Activo' : 'Retirado' }}
                  </span>
                </div>
                <button
                  class="remove"
                  (click)="remove(listener.id)"
                  [attr.aria-disabled]="!listener.active"
                >
                  Retirar suscriptor {{ listener.id }}
                </button>
              </header>
              <dl class="channels">
                @for (type of types; track type) {
                  <div class="channel">
                    <dt>
                      <code>{{ type }}</code>
                    </dt>
                    <dd>
                      @if (listener.values[type].length > 0) {
                        <ol class="values" role="list" aria-label="Emisiones en orden de llegada">
                          @for (value of listener.values[type]; track value) {
                            <li>{{ value }}</li>
                          }
                        </ol>
                      } @else {
                        <span class="empty">Sin emisiones</span>
                      }
                    </dd>
                  </div>
                }
              </dl>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SubjectLab {
  private sources = this.createSources();
  private readonly subscriptions = new Map<number, Subscription>();
  protected readonly types = subjectTypes;
  protected readonly listeners = signal<Listener[]>([]);
  protected readonly nextValue = signal(1);
  protected readonly status = signal('Agrega un suscriptor o emite un valor antes de agregarlo.');

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  emit(): void {
    const value = this.nextValue();
    for (const type of this.types) this.sources[type].next(value);
    this.nextValue.set(value + 1);
    this.status.set(`Valor ${value} emitido en los tres Subjects.`);
  }

  add(): void {
    if (this.listeners().length >= 8) return;
    const id = this.listeners().length + 1;
    this.listeners.update((listeners) => [
      ...listeners,
      {
        id,
        active: true,
        values: { Subject: [], BehaviorSubject: [], ReplaySubject: [] },
      },
    ]);
    const subscription = new Subscription();
    for (const type of this.types) {
      subscription.add(
        this.sources[type].subscribe((value) => {
          this.listeners.update((listeners) =>
            listeners.map((listener) =>
              listener.id === id
                ? {
                    ...listener,
                    values: {
                      ...listener.values,
                      [type]: [...listener.values[type].slice(-11), value],
                    },
                  }
                : listener,
            ),
          );
        }),
      );
    }
    this.subscriptions.set(id, subscription);
    this.status.set(`Suscriptor ${id} agregado.`);
  }

  remove(id: number): void {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return;
    subscription.unsubscribe();
    this.subscriptions.delete(id);
    this.listeners.update((listeners) =>
      listeners.map((listener) => (listener.id === id ? { ...listener, active: false } : listener)),
    );
    this.status.set(`Suscriptor ${id} retirado.`);
  }

  reset(): void {
    this.dispose();
    this.sources = this.createSources();
    this.listeners.set([]);
    this.nextValue.set(1);
    this.status.set('Subjects reiniciados.');
  }

  private createSources() {
    return {
      Subject: new Subject<number>(),
      BehaviorSubject: new BehaviorSubject(0),
      ReplaySubject: new ReplaySubject<number>(2),
    };
  }

  private dispose(): void {
    for (const subscription of this.subscriptions.values()) subscription.unsubscribe();
    this.subscriptions.clear();
    for (const type of this.types) this.sources[type].complete();
  }
}
