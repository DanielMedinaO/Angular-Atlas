import { Component, signal } from '@angular/core';

type ReadingState = 'pendiente' | 'en curso' | 'terminada';

@Component({
  selector: 'app-template-lab',
  templateUrl: './template-lab.html',
  styleUrls: ['../lab.scss', './template-lab.scss'],
})
export class TemplateLab {
  protected readonly pages = signal(0);
  protected readonly extra = signal(false);
  protected readonly topics = ['Signals', 'Router'];
  protected readonly readingState = signal<ReadingState>('pendiente');
  protected readonly states: readonly { value: ReadingState; label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en curso', label: 'En curso' },
    { value: 'terminada', label: 'Terminada' },
  ];
  protected readonly showNote = signal(true);

  protected readonly snippets = {
    arrow: '<button (click)="pages.update(total => total + 1)">Sumar página</button>',
    spread: `{{ summarize(...[...topics, ...(extra() ? ['Angular Aria'] : [])]) }}`,
    rest: `summarize(...topics: string[]): string {
  return topics.join(' · ');
}`,
    grouped: `@let currentState = readingState();
@switch (currentState) {
  @case ('pendiente')
  @case ('en curso') { <p>Por completar</p> }
  @case ('terminada') { <p>Lectura completada</p> }
}`,
    exhaustive: `@let currentState = readingState();
@switch (currentState) {
  @case ('pendiente') { <p>Aún sin empezar</p> }
  @case ('en curso') { <p>Lectura iniciada</p> }
  @case ('terminada') { <p>Lectura archivada</p> }
  @default never;
}`,
    comments: `<p
  // Conserva la nota en el DOM al ocultarla.
  [hidden]="!showNote()"
  /* Anuncia el texto cuando se muestra. */
  role="status"
>Revisa la documentación oficial.</p>`,
  };

  protected summarize(...topics: string[]): string {
    return topics.join(' · ');
  }
}
