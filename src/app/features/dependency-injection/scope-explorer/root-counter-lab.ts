import { Component, inject, input } from '@angular/core';
import { RootCounterService } from './counter-services';

@Component({
  selector: 'app-root-counter-consumer',
  template: `
    <article class="di-card">
      <h3>Consumidor {{ name() }}</h3>
      <p>Contador global: <output>{{ counter.count() }}</output></p>
      <button type="button" (click)="counter.increment()">
        Incrementar desde {{ name() }}
      </button>
    </article>
  `,
  styleUrl: '../di-labs.scss',
})
export class RootCounterConsumer {
  readonly name = input.required<string>();
  protected readonly counter = inject(RootCounterService);
}

@Component({
  selector: 'app-root-counter-lab',
  imports: [RootCounterConsumer],
  template: `
    <div class="di-lab-grid">
      <section aria-label="Primera sección que consume el servicio root">
        <app-root-counter-consumer name="A" />
      </section>
      <section aria-label="Segunda sección que consume el servicio root">
        <app-root-counter-consumer name="B" />
      </section>
    </div>
  `,
  styleUrl: '../di-labs.scss',
})
export class RootCounterLab {}
