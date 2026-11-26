import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-templates-lab',
  imports: [NgTemplateOutlet],
  styleUrl: '../shared/fundamentals-lab.scss',
  template: `
    <label for="template-name">Nombre de la lectora o el lector</label>
    <div class="actions">
      <input id="template-name" #nameField value="Ada" />
      <button type="button" (click)="previewName.set(nameField.value.trim() || 'visitante')">
        Actualizar saludo
      </button>
    </div>
    <ng-template #greeting let-name>
      <p>Hola, {{ name }}. Tu biblioteca está lista.</p>
    </ng-template>
    <div role="status">
      @if (previewName(); as name) {
        <ng-container *ngTemplateOutlet="greeting; context: { $implicit: name }" />
      } @else {
        <p>Actualiza el saludo para renderizar la plantilla.</p>
      }
    </div>
  `,
})
export class TemplatesLab {
  protected readonly previewName = signal('');
}
