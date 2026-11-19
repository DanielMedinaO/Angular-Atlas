import { Component, InjectionToken, inject } from '@angular/core';

export interface BookSectionConfiguration {
  readonly sectionName: string;
  readonly maxBooks: number;
}

export const BOOK_SECTION_CONFIGURATION = new InjectionToken<BookSectionConfiguration>(
  'BOOK_SECTION_CONFIGURATION',
);

@Component({
  selector: 'app-section-configuration-display',
  template: `
    <article class="di-card">
      <h3>{{ configuration.sectionName }}</h3>
      <p>Máximo de libros permitidos: <output>{{ configuration.maxBooks }}</output></p>
    </article>
  `,
  styleUrl: './di-labs.scss',
})
export class SectionConfigurationDisplay {
  protected readonly configuration = inject(BOOK_SECTION_CONFIGURATION);
}

@Component({
  selector: 'app-fiction-section',
  imports: [SectionConfigurationDisplay],
  providers: [
    {
      provide: BOOK_SECTION_CONFIGURATION,
      useValue: { sectionName: 'Ficción', maxBooks: 8 } satisfies BookSectionConfiguration,
    },
  ],
  template: '<app-section-configuration-display />',
})
export class FictionSection {}

@Component({
  selector: 'app-reference-section',
  imports: [SectionConfigurationDisplay],
  providers: [
    {
      provide: BOOK_SECTION_CONFIGURATION,
      useValue: { sectionName: 'Referencia', maxBooks: 3 } satisfies BookSectionConfiguration,
    },
  ],
  template: '<app-section-configuration-display />',
})
export class ReferenceSection {}

@Component({
  selector: 'app-injection-token-lab',
  imports: [FictionSection, ReferenceSection],
  template: `
    <div class="di-token-sections">
      <app-fiction-section />
      <app-reference-section />
    </div>
  `,
})
export class InjectionTokenLab {}
