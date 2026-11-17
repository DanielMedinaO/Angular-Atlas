import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme';

describe('ThemeService', () => {
  let doc: Document;
  let storage: Storage;
  let media: EventTarget & { matches: boolean };
  let win: EventTarget;

  function createService(saved: string | null = null, systemDark = false): ThemeService {
    doc = document.implementation.createHTMLDocument();
    storage = {
      getItem: vi.fn(() => saved),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };
    media = Object.assign(new EventTarget(), { matches: systemDark });
    win = new EventTarget();
    Object.defineProperties(win, {
      localStorage: { value: storage },
      matchMedia: { value: () => media },
    });
    Object.defineProperty(doc, 'defaultView', { value: win });
    TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: doc }] });
    return TestBed.inject(ThemeService);
  }

  it('follows the system until the user chooses a theme', () => {
    const service = createService(null, true);
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.hasAttribute('data-theme')).toBe(false);

    media.dispatchEvent(Object.assign(new Event('change'), { matches: false }));
    expect(service.theme()).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.dataset['theme']).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');

    media.dispatchEvent(Object.assign(new Event('change'), { matches: false }));
    expect(service.theme()).toBe('dark');
  });

  it('restores a saved theme and allows changing it', () => {
    const service = createService('light', true);
    expect(service.theme()).toBe('light');
    expect(doc.documentElement.dataset['theme']).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });

  it('ignores invalid stored values and synchronizes changes from another tab', () => {
    const service = createService('invalid');
    expect(service.theme()).toBe('light');
    expect(doc.documentElement.hasAttribute('data-theme')).toBe(false);
    vi.mocked(storage.getItem).mockReturnValue('dark');
    win.dispatchEvent(Object.assign(new Event('storage'), { key: THEME_STORAGE_KEY }));
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.dataset['theme']).toBe('dark');
    vi.mocked(storage.getItem).mockReturnValue(null);
    win.dispatchEvent(Object.assign(new Event('storage'), { key: null }));
    expect(service.theme()).toBe('light');
    expect(doc.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('still changes the current theme and reports a storage failure', () => {
    const service = createService();
    vi.mocked(storage.setItem).mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      service.toggle();
      expect(service.theme()).toBe('dark');
      expect(doc.documentElement.dataset['theme']).toBe('dark');
      expect(warning).toHaveBeenCalled();
    } finally {
      warning.mockRestore();
    }
  });
});
