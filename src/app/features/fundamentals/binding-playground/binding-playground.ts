import { Component, model, signal } from '@angular/core';

@Component({
  selector: 'app-binding-title-editor',
  styleUrl: '../shared/fundamentals-lab.scss',
  template: `
    <label for="binding-title">Título</label>
    <input id="binding-title" #field [value]="value()" (input)="value.set(field.value)" />
  `,
})
class BindingTitleEditor {
  readonly value = model.required<string>();
}

@Component({
  selector: 'app-binding-playground',
  imports: [BindingTitleEditor],
  styleUrl: '../shared/fundamentals-lab.scss',
  template: `
    <app-binding-title-editor [(value)]="title" />
    <label class="actions">
      <input
        type="checkbox"
        #toggle
        [checked]="buttonsEnabled()"
        (change)="buttonsEnabled.set(toggle.checked)"
      />
      Habilitar los botones del contador
    </label>
    <button type="button" (click)="title.set(initialTitle)">Restaurar título</button>
    <div class="actions">
      <button type="button" [disabled]="!buttonsEnabled()" (click)="increment()">
        Incrementar
      </button>
      <button type="button" [disabled]="!buttonsEnabled()" (click)="count.set(0)">
        Reiniciar contador
      </button>
    </div>
    <p [attr.data-count]="count()" role="status">{{ title() }} · Contador: {{ count() }}</p>
  `,
})
export class BindingPlayground {
  protected readonly initialTitle = 'Mi biblioteca';
  protected readonly title = signal(this.initialTitle);
  protected readonly count = signal(0);
  protected readonly buttonsEnabled = signal(true);

  protected increment(): void {
    this.count.update((count) => count + 1);
  }
}
