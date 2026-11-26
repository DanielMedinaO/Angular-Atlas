import { Component, input } from '@angular/core';

@Component({
  selector: 'app-deferred-chart-state',
  styleUrl: './deferred-chart-state.scss',
  template: `
    @switch (state()) {
      @case ('pending') {
        <div class="state">
          <div class="preview" aria-hidden="true"><span></span><span></span><span></span></div>
          <p class="state-title">Gráfico pendiente de interacción</p>
          <p class="state-detail">
            @if (prefetch()) {
              El código puede descargarse en idle. Pulsa «Mostrar gráfico» para renderizarlo.
            } @else {
              Pulsa «Mostrar gráfico» para solicitar el código y renderizarlo.
            }
          </p>
        </div>
      }
      @case ('loading') {
        <div class="state">
          <span class="spinner" aria-hidden="true"></span>
          <p class="state-title">Cargando gráfico…</p>
          <p class="state-detail">Angular está descargando sus dependencias.</p>
        </div>
      }
      @case ('error') {
        <div class="state state-error">
          <span class="error-symbol" aria-hidden="true">!</span>
          <p class="state-title">No se pudo cargar el gráfico</p>
          <p class="state-detail">Recarga la página para volver a intentarlo.</p>
        </div>
      }
    }
  `,
})
export class DeferredChartState {
  readonly state = input.required<'pending' | 'loading' | 'error'>();
  readonly prefetch = input(false);
}
