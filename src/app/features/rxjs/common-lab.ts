import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { examples, searchTerms } from './common-examples';

@Component({
  selector: 'app-rxjs-common',
  styleUrl: './rxjs-lab.scss',
  template: `
    <div class="lab">
      <div class="console">
        <div class="toolbar">
          <label class="picker">
            Operador
            <select #operator (change)="select(operator.selectedIndex)">
              @for (example of examples; track example.name) {
                <option>{{ example.name }}</option>
              }
            </select>
          </label>
          <div class="actions">
            <button class="primary" (click)="run()">
              <span aria-hidden="true">▶</span> Ejecutar ejemplo
            </button>
            <button (click)="cancel()" [attr.aria-disabled]="!running()">Detener ejemplo</button>
          </div>
        </div>
        <p>{{ selected().description }}</p>
      </div>
      <div class="workspace">
        <div class="panel">
          <h3>Código</h3>
          <pre
            tabindex="0"
            aria-label="Código del operador seleccionado"
          ><code>{{ selected().code }}</code></pre>
        </div>
        <div class="panel">
          <h3>Salida</h3>
          <div class="output" role="log" aria-label="Salida del ejemplo">
            @if (logs().length > 0) {
              <ol class="log">
                @for (entry of logs(); track $index) {
                  <li>{{ entry }}</li>
                }
              </ol>
            } @else {
              <p>Ejecuta el ejemplo para ver las emisiones.</p>
            }
          </div>
        </div>
      </div>
      <div class="panel">
        <h3>debounceTime y distinctUntilChanged</h3>
        <p>
          Una búsqueda espera 350 ms de silencio. Si el término recortado coincide con el último
          emitido, se descarta. Escribe, espera y luego agrega espacios al final.
        </p>
        <label
          >Consulta
          <input #term type="text" (input)="terms.next(term.value)" />
        </label>
        <div class="output" role="status">
          <strong>Consultas emitidas</strong>
          @if (queries().length > 0) {
            <ul class="timeline" role="list">
              @for (query of queries(); track $index) {
                <li>{{ query }}</li>
              }
            </ul>
          } @else {
            <p>Sin consultas emitidas</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class CommonLab {
  private subscription?: Subscription;
  protected readonly examples = examples;
  protected readonly selected = signal(examples[0]);
  protected readonly running = signal(false);
  protected readonly logs = signal<string[]>([]);
  protected readonly queries = signal<string[]>([]);
  protected readonly terms = new Subject<string>();

  constructor() {
    searchTerms(this.terms)
      .pipe(takeUntilDestroyed())
      .subscribe((term) => {
        this.queries.update((queries) => [...queries.slice(-7), JSON.stringify(term)]);
      });
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  select(index: number): void {
    this.cancel();
    this.selected.set(examples[index]);
    this.logs.set([]);
  }

  run(): void {
    this.cancel();
    this.logs.set([]);
    this.running.set(true);
    this.subscription = this.selected()
      .run((message) => this.record(message))
      .subscribe({
        next: (value) => this.record(`next · ${value}`),
        complete: () => {
          this.record('complete');
          this.running.set(false);
        },
        error: (error: Error) => {
          this.record(`error · ${error.message}`);
          this.running.set(false);
        },
      });
  }

  cancel(): void {
    if (!this.running()) return;
    this.subscription?.unsubscribe();
    this.running.set(false);
    this.record('unsubscribe');
  }

  private record(message: string): void {
    this.logs.update((logs) => [...logs, message]);
  }
}
