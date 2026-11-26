import { Component, inject, signal } from '@angular/core';
import { BookRepository } from './book-repository';
import { ReactiveFormLab } from './reactive-form-lab/reactive-form-lab';
import { SignalFormLab } from './signal-form-lab/signal-form-lab';

type LabTab = 'reactive' | 'signal';

// Contenedor: orquesta las pestañas y aloja el repositorio en memoria compartido por ambos laboratorios.
@Component({
  selector: 'app-forms-page',
  imports: [ReactiveFormLab, SignalFormLab],
  providers: [BookRepository],
  templateUrl: './forms-page.html',
  styleUrl: './forms-page.scss',
})
export class FormsPage {
  protected readonly activeTab = signal<LabTab>('reactive');
  protected readonly registeredBooks = inject(BookRepository).books;

  protected setActiveTab(tab: LabTab): void {
    this.activeTab.set(tab);
  }

  protected onTabKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const nextTab = this.activeTab() === 'reactive' ? 'signal' : 'reactive';
    this.setActiveTab(nextTab);
    (event.currentTarget as HTMLElement)
      .querySelector<HTMLButtonElement>(`#${nextTab}-tab`)
      ?.focus();
  }
}
