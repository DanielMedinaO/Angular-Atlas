import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'atlas.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;
  private readonly media = this.window?.matchMedia?.('(prefers-color-scheme: dark)');
  private readonly systemTheme = signal<Theme>(this.media?.matches ? 'dark' : 'light');
  private readonly preference = signal<Theme | null>(this.readPreference());
  readonly theme = computed(() => this.preference() ?? this.systemTheme());

  constructor() {
    this.applyPreference();

    const onSystemChange = (event: MediaQueryListEvent) => {
      this.systemTheme.set(event.matches ? 'dark' : 'light');
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        this.preference.set(this.readPreference());
        this.applyPreference();
      }
    };

    this.media?.addEventListener('change', onSystemChange);
    this.window?.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => {
      this.media?.removeEventListener('change', onSystemChange);
      this.window?.removeEventListener('storage', onStorage);
    });
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.preference.set(next);
    this.applyPreference();
    try {
      this.window?.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema.', error);
    }
  }

  private readPreference(): Theme | null {
    try {
      const value = this.window?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
      console.warn('No se pudo leer la preferencia de tema.', error);
      return null;
    }
  }

  private applyPreference(): void {
    const preference = this.preference();
    if (preference) {
      this.document.documentElement.dataset['theme'] = preference;
    } else {
      delete this.document.documentElement.dataset['theme'];
    }
  }
}
