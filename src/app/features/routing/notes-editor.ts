import { Component, computed, signal } from '@angular/core';
import { NotesEditorRoute } from './notes-guard';

@Component({
  selector: 'app-notes-editor',
  template: `
    <section class="notes" aria-labelledby="notes-title">
      <h3 id="notes-title">Editor de notas</h3>
      <label for="note-text">Tu nota</label>
      <textarea
        id="note-text"
        rows="5"
        [value]="draft()"
        (input)="updateDraft($event)"
      ></textarea>
      <div class="notes__actions">
        <button type="button" (click)="save()">Guardar nota</button>
        @if (hasUnsavedChanges()) {
          <span role="status">Tienes cambios sin guardar.</span>
        } @else {
          <span role="status">Todos los cambios están guardados.</span>
        }
      </div>
      <p><strong>Última versión guardada:</strong> {{ saved() || 'Sin notas guardadas' }}</p>
    </section>
  `,
  styles: `
    .notes { display: grid; gap: 0.75rem; }
    .notes label { font-weight: 600; }
    .notes textarea { width: 100%; resize: vertical; padding: 0.65rem; font: inherit; }
    .notes__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
    .notes__actions button { padding: 0.5rem 0.75rem; cursor: pointer; }
    .notes__actions span { color: var(--atlas-text-muted); }
  `,
})
export class NotesEditor implements NotesEditorRoute {
  protected readonly draft = signal('');
  protected readonly saved = signal('');
  private readonly unsavedChanges = computed(() => this.draft() !== this.saved());

  hasUnsavedChanges(): boolean {
    return this.unsavedChanges();
  }

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected save(): void {
    this.saved.set(this.draft());
  }
}
