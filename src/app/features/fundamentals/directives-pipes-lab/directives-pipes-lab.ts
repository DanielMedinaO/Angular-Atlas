import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, Directive, Pipe, PipeTransform, signal } from '@angular/core';

@Directive({
  selector: '[appReadingHighlight]',
  host: { '[class.reading-highlight]': 'true' },
})
export class ReadingHighlight {}

@Pipe({ name: 'readingTime', pure: true })
export class ReadingTime implements PipeTransform {
  transform(pages: number): string {
    return `≈ ${Math.ceil(pages / 2)} min`;
  }
}

@Component({
  selector: 'app-directives-pipes-lab',
  imports: [ReadingHighlight, ReadingTime, DatePipe, CurrencyPipe, UpperCasePipe],
  styleUrl: '../shared/fundamentals-lab.scss',
  template: `
    <p appReadingHighlight>
      <strong>Selección destacada:</strong> {{ 'Angular en práctica' | uppercase }}
    </p>
    <dl>
      <dt>Publicación (DatePipe)</dt>
      <dd>{{ publishedOn | date: 'dd/MM/yyyy' : 'UTC' }}</dd>
      <dt>Precio (CurrencyPipe)</dt>
      <dd>{{ 18.5 | currency: 'USD' : 'code' }}</dd>
      <dt>Tiempo estimado (ReadingTime)</dt>
      <dd>{{ pages() | readingTime }}</dd>
    </dl>
    <label for="reading-pages">Páginas</label>
    <select id="reading-pages" #length [value]="pages()" (change)="setPages(length.value)">
      <option value="15">15 páginas</option>
      <option value="30">30 páginas</option>
      <option value="60">60 páginas</option>
    </select>
  `,
})
export class DirectivesPipesLab {
  protected readonly publishedOn = '2026-01-15T00:00:00Z';
  protected readonly pages = signal(15);

  protected setPages(value: string): void {
    this.pages.set(Number(value));
  }
}
