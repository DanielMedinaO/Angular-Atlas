import { inject, InjectionToken } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { NotesEditor } from './notes-editor';

export interface NotesEditorRoute {
  hasUnsavedChanges(): boolean;
}

export const NOTES_CONFIRM = new InjectionToken<(message: string) => boolean>(
  'NOTES_CONFIRM',
  {
    providedIn: 'root',
    factory: () => (message) => window.confirm(message),
  },
);

export const canDeactivateNotes: CanDeactivateFn<NotesEditorRoute> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return inject(NOTES_CONFIRM)('Hay cambios sin guardar. ¿Quieres abandonar el editor?');
};
