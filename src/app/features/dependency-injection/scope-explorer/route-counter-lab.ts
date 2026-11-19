import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouteCounterService } from './counter-services';

@Component({
  selector: 'app-route-counter-consumer',
  template: `
    <article class="di-card">
      <h3>Consumidor {{ name() }}</h3>
      <p>Contador de esta ruta: <output>{{ counter.count() }}</output></p>
      <button type="button" (click)="counter.increment()">
        Incrementar desde {{ name() }}
      </button>
    </article>
  `,
  styleUrl: '../di-labs.scss',
})
export class RouteCounterConsumer {
  readonly name = input.required<string>();
  protected readonly counter = inject(RouteCounterService);
}

@Component({
  selector: 'app-library-route-lab',
  imports: [RouteCounterConsumer],
  template: `
    <section class="di-route-panel" aria-labelledby="library-route-title">
      <h3 id="library-route-title">Ruta library</h3>
      <p>Ambos consumidores resuelven el provider de esta ruta.</p>
      <div class="di-lab-grid">
        <app-route-counter-consumer name="A" />
        <app-route-counter-consumer name="B" />
      </div>
    </section>
  `,
  styleUrl: '../di-labs.scss',
})
export class LibraryRouteLab {}

@Component({
  selector: 'app-admin-route-lab',
  imports: [RouteCounterConsumer],
  template: `
    <section class="di-route-panel" aria-labelledby="admin-route-title">
      <h3 id="admin-route-title">Ruta admin</h3>
      <p>Esta configuración de ruta tiene otro provider y otra instancia.</p>
      <div class="di-lab-grid">
        <app-route-counter-consumer name="A" />
        <app-route-counter-consumer name="B" />
      </div>
    </section>
  `,
  styleUrl: '../di-labs.scss',
})
export class AdminRouteLab {}

@Component({
  selector: 'app-route-counter-lab',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="di-route-nav" aria-label="Rutas para comparar proveedores">
      <a routerLink="library" routerLinkActive="di-route-link--active" ariaCurrentWhenActive="page">
        library
      </a>
      <a routerLink="admin" routerLinkActive="di-route-link--active" ariaCurrentWhenActive="page">
        admin
      </a>
    </nav>
  `,
  styleUrl: '../di-labs.scss',
})
export class RouteCounterLab {}
