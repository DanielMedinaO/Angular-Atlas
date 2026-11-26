import { Component, computed, signal } from '@angular/core';
import { AssertionResult, evaluateAssertions } from './assertions';

@Component({
  selector: 'app-assertions-playground',
  styleUrl: './assertions-playground.scss',
  template: `
    <section class="assertions" aria-labelledby="assertions-title">
      <h3 id="assertions-title">Assertions Playground</h3>
      <p class="assertions__notice" data-testid="simulation-notice">
        Simulación educativa de assertions: la lógica corre en el navegador, pero
        <strong>no ejecuta Vitest</strong> ni un runner real. Las pruebas reales de esta lógica
        viven en <code>assertions.spec.ts</code> y se ejecutan con
        <code>npx ng test --watch=false</code>.
      </p>

      <div class="assertions__counter">
        <span id="assertions-counter-label">Contador actual</span>
        <button type="button" data-testid="decrement" aria-label="Restar 1" (click)="change(-1)">
          −
        </button>
        <output
          class="assertions__value"
          data-testid="counter"
          aria-labelledby="assertions-counter-label"
          >{{ counter() }}</output
        >
        <button type="button" data-testid="increment" aria-label="Sumar 1" (click)="change(1)">
          +
        </button>
      </div>

      <div class="assertions__actions">
        <button type="button" class="assertions__run" data-testid="run" (click)="run()">
          Ejecutar verificaciones
        </button>
        <button type="button" data-testid="reset" (click)="reset()">Reiniciar</button>
      </div>

      @if (results().length === 0) {
        <p class="assertions__summary" data-testid="empty">
          Todavía no se ha ejecutado ninguna verificación.
        </p>
      } @else {
        <p class="assertions__summary" role="status" data-testid="summary">
          {{ summary() }}
          @if (stale()) {
            <span class="assertions__stale" data-testid="stale">
              · El contador cambió: vuelve a ejecutar las verificaciones.</span
            >
          }
        </p>
        <div
          class="assertions__table-wrap"
          role="region"
          tabindex="0"
          aria-labelledby="assertions-results-caption"
        >
          <table>
            <caption id="assertions-results-caption" class="sr-only">
              Resultados simulados de las verificaciones
            </caption>
            <thead>
              <tr>
                <th scope="col">Verificación</th>
                <th scope="col">Esperado</th>
                <th scope="col">Obtenido</th>
                <th scope="col">Resultado</th>
              </tr>
            </thead>
            <tbody>
              @for (result of results(); track result.id) {
                <tr [attr.data-testid]="'result-' + result.id">
                  <td>
                    <code>{{ result.code }}</code>
                  </td>
                  <td data-testid="expected">{{ result.expected }}</td>
                  <td data-testid="received">{{ result.received }}</td>
                  <td>
                    <span
                      class="assertions__verdict"
                      data-testid="verdict"
                      [class.assertions__verdict--pass]="result.passed"
                      [class.assertions__verdict--fail]="!result.passed"
                      >{{ result.passed ? 'PASS' : 'FAIL' }}</span
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class AssertionsPlayground {
  protected readonly counter = signal(0);
  protected readonly results = signal<readonly AssertionResult[]>([]);
  private readonly evaluatedCounter = signal<number | null>(null);

  protected readonly stale = computed(
    () => this.evaluatedCounter() !== null && this.evaluatedCounter() !== this.counter(),
  );
  protected readonly summary = computed(() => {
    const results = this.results();
    const passed = results.filter((result) => result.passed).length;
    return `${passed} de ${results.length} verificaciones pasan con contador = ${this.evaluatedCounter()}.`;
  });

  protected change(delta: number): void {
    this.counter.update((value) => value + delta);
  }

  protected run(): void {
    this.results.set(evaluateAssertions(this.counter()));
    this.evaluatedCounter.set(this.counter());
  }

  protected reset(): void {
    this.counter.set(0);
    this.results.set([]);
    this.evaluatedCounter.set(null);
  }
}
