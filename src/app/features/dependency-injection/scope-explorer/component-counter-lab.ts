import { Component, inject } from '@angular/core';
import { ComponentCounterService } from './counter-services';

@Component({
  selector: 'app-component-counter',
  providers: [ComponentCounterService],
  template: `
    <article class="di-card">
      <h3>Instancia de componente</h3>
      <p>Contador local: <output>{{ counter.count() }}</output></p>
      <button type="button" (click)="counter.increment()">Incrementar este contador</button>
    </article>
  `,
  styleUrl: '../di-labs.scss',
})
export class ComponentCounter {
  protected readonly counter = inject(ComponentCounterService);
}

@Component({
  selector: 'app-component-counter-lab',
  imports: [ComponentCounter],
  template: `
    <div class="di-lab-grid">
      <app-component-counter />
      <app-component-counter />
    </div>
  `,
  styleUrl: '../di-labs.scss',
})
export class ComponentCounterLab {}
