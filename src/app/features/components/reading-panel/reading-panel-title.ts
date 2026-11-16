import { Directive } from '@angular/core';

let nextTitleId = 0;

// Marca el título proyectado. Sirve como selector del slot y como token de contentChild().
@Directive({
  selector: '[readingPanelTitle]',
  host: { '[id]': 'id' },
})
export class ReadingPanelTitle {
  readonly id = `reading-panel-title-${nextTitleId++}`;
}
