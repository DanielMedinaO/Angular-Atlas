import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { BookRepository } from './book-repository';
import { FormsPage } from './forms-page';

function setInput(page: HTMLElement, id: string, value: string): void {
  const input = page.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    throw new Error(`Input #${id} was not rendered.`);
  }
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('blur'));
}

function submit(page: HTMLElement, selector: string): void {
  const form = page.querySelector<HTMLFormElement>(selector);
  if (!form) {
    throw new Error(`Form ${selector} was not rendered.`);
  }
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function fillReactiveForm(page: HTMLElement, title = 'Practical Angular'): void {
  setInput(page, 'reactive-title', title);
  setInput(page, 'reactive-author', 'Ada Lovelace');
}

function fillSignalForm(page: HTMLElement, title = 'Practical Angular'): void {
  setInput(page, 'signal-title', title);
  setInput(page, 'signal-author', 'Ada Lovelace');
}

async function createPage() {
  await TestBed.configureTestingModule({ imports: [FormsPage] }).compileComponents();
  const fixture = TestBed.createComponent(FormsPage);
  fixture.detectChanges();
  await fixture.whenStable();
  return {
    fixture,
    page: fixture.nativeElement as HTMLElement,
    repository: fixture.debugElement.injector.get(BookRepository),
  };
}

describe('FormsPage', () => {
  it('renders the documentation, both independent labs, and the comparison tabs', async () => {
    const { fixture, page } = await createPage();

    expect(page.querySelector('.forms-page__title')?.textContent).toContain('Formularios');
    expect(page.querySelector('#reactive-panel form')).toBeTruthy();
    expect(page.querySelector('#signal-panel form')).toBeTruthy();
    expect(page.querySelector<HTMLElement>('#signal-panel')?.hidden).toBe(true);
    expect(page.textContent).toContain('FieldTree');
    expect(page.textContent).toContain('FormArray');
    expect(page.textContent).toContain('backend');
    expect(page.textContent).toContain('Reto práctico');

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();

    expect(page.querySelector<HTMLElement>('#signal-panel')?.hidden).toBe(false);
    expect(page.querySelector<HTMLElement>('#reactive-panel')?.hidden).toBe(true);
  });

  it('enforces Reactive Forms required, minimum length, year range, and visible submit errors', async () => {
    const { fixture, page } = await createPage();
    setInput(page, 'reactive-title', 'AB');
    setInput(page, 'reactive-year', '1400');
    submit(page, '#reactive-panel form');
    fixture.detectChanges();

    expect(page.textContent).toContain('Escribe al menos 3 caracteres.');
    expect(page.textContent).toContain('El año debe ser 1450 o posterior.');
    expect(page.querySelectorAll('.forms-page__error').length).toBeGreaterThanOrEqual(2);
  });

  it('validates Signal Forms required fields, minimum length, and year range after submit', async () => {
    const { fixture, page } = await createPage();
    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    setInput(page, 'signal-title', 'AB');
    setInput(page, 'signal-year', '2200');
    submit(page, '#signal-panel form');
    fixture.detectChanges();

    expect(page.textContent).toContain('Escribe al menos 3 caracteres.');
    expect(page.textContent).toContain('El año no puede ser posterior');
    expect(page.textContent).toContain('El autor es obligatorio.');
  });

  it('updates independent values through Reactive Forms and Signal Forms bindings', async () => {
    const { fixture, page } = await createPage();

    setInput(page, 'reactive-title', 'Reactive title');
    fixture.detectChanges();
    expect(page.querySelector('#reactive-panel pre')?.textContent).toContain('Reactive title');

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    setInput(page, 'signal-title', 'Signal title');
    fixture.detectChanges();
    expect(page.querySelector('#signal-panel pre')?.textContent).toContain('Signal title');

    page.querySelector<HTMLButtonElement>('#reactive-tab')!.click();
    fixture.detectChanges();
    expect(page.querySelector('#reactive-panel pre')?.textContent).toContain('Reactive title');
  });

  it('uses setValue, patchValue, and reset in the Reactive Forms lab', async () => {
    const { fixture, page } = await createPage();

    page.querySelector<HTMLButtonElement>('.forms-page__examples button:nth-child(1)')!.click();
    fixture.detectChanges();
    expect(page.querySelector<HTMLInputElement>('#reactive-title')!.value).toBe(
      'Clean Architecture',
    );

    page.querySelector<HTMLButtonElement>('.forms-page__examples button:nth-child(2)')!.click();
    fixture.detectChanges();
    expect(page.querySelector<HTMLInputElement>('#reactive-title')!.value).toBe(
      'Domain-Driven Design',
    );

    page.querySelector<HTMLButtonElement>('.forms-page__examples button:nth-child(3)')!.click();
    fixture.detectChanges();
    expect(page.querySelector<HTMLInputElement>('#reactive-title')!.value).toBe('');
  });

  it('adds and removes validated stable author fields in both approaches', async () => {
    const { fixture, page } = await createPage();

    page.querySelector<HTMLButtonElement>('#reactive-panel .forms-page__dynamic > button')!.click();
    fixture.detectChanges();
    expect(page.querySelectorAll('#reactive-panel .forms-page__dynamic-row')).toHaveLength(1);
    setInput(page, 'reactive-additional-author-0', '   ');
    submit(page, '#reactive-panel form');
    fixture.detectChanges();
    expect(page.textContent).toContain('Este campo no puede contener solo espacios.');
    page
      .querySelector<HTMLButtonElement>(
        '#reactive-panel [aria-label="Eliminar autor adicional 1"]',
      )!
      .click();
    fixture.detectChanges();
    expect(page.querySelectorAll('#reactive-panel .forms-page__dynamic-row')).toHaveLength(0);

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    page
      .querySelector<HTMLButtonElement>('#signal-panel .forms-page__dynamic > button:last-child')!
      .click();
    fixture.detectChanges();
    expect(page.querySelectorAll('#signal-panel .forms-page__dynamic-row')).toHaveLength(1);
    setInput(page, 'signal-additional-author-0', '   ');
    submit(page, '#signal-panel form');
    fixture.detectChanges();
    expect(page.textContent).toContain('El nombre del autor adicional es obligatorio.');
    page
      .querySelector<HTMLButtonElement>('#signal-panel [aria-label="Eliminar autor adicional 1"]')!
      .click();
    fixture.detectChanges();
    expect(page.querySelectorAll('#signal-panel .forms-page__dynamic-row')).toHaveLength(0);
  });

  it('detects an ISBN already registered in the local repository in both validators', async () => {
    const { fixture, page } = await createPage();
    setInput(page, 'reactive-isbn', '978-0-13-235088-4');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.textContent).toContain('Ya existe un libro con este ISBN.');
    });

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    setInput(page, 'signal-isbn', '978-0-13-235088-4');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.textContent).toContain('Ya existe un libro con este ISBN.');
    });
  });

  it('blocks Reactive Forms submission while ISBN validation is pending', async () => {
    const { fixture, page, repository } = await createPage();
    fillReactiveForm(page);
    setInput(page, 'reactive-isbn', '9780306406157');
    submit(page, '#reactive-panel form');
    fixture.detectChanges();

    expect(repository.books()).toHaveLength(0);
    expect(page.textContent).toContain('Espera a que termine la validación del ISBN.');
    await vi.waitFor(() => expect(page.textContent).not.toContain('Comprobando ISBN'));
  });

  it('blocks Signal Forms submission while ISBN validation is pending', async () => {
    const { fixture, page, repository } = await createPage();
    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    fillSignalForm(page);
    setInput(page, 'signal-isbn', '9780306406157');
    submit(page, '#signal-panel form');
    fixture.detectChanges();

    expect(repository.books()).toHaveLength(0);
    expect(page.textContent).toContain('El formulario está esperando una validación asíncrona.');
    await vi.waitFor(() => expect(page.textContent).not.toContain('Comprobando ISBN'));
    expect(repository.books()).toHaveLength(0);
  });

  it('surfaces ISBN validation failures instead of silently accepting them', async () => {
    const { fixture, page, repository } = await createPage();
    vi.spyOn(repository, 'isDuplicateIsbn').mockRejectedValue(new Error('Local check failed'));
    setInput(page, 'reactive-isbn', '9780000000000');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.textContent).toContain('No se pudo comprobar el ISBN.');
    });

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    setInput(page, 'signal-isbn', '9780000000001');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.textContent).toContain('No se pudo comprobar el ISBN.');
    });
  });

  it('aborts obsolete ISBN checks when a newer value is entered', async () => {
    const { fixture, page, repository } = await createPage();
    const abortSignals: AbortSignal[] = [];
    const checkIsbn = repository.isDuplicateIsbn.bind(repository);
    vi.spyOn(repository, 'isDuplicateIsbn').mockImplementation((isbn, abortSignal) => {
      if (abortSignal) {
        abortSignals.push(abortSignal);
      }
      return checkIsbn(isbn, abortSignal);
    });

    setInput(page, 'reactive-isbn', '9780306406157');
    fixture.detectChanges();
    setInput(page, 'reactive-isbn', '978-0-13-235088-4');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.querySelector('#reactive-panel')?.textContent).toContain(
        'Ya existe un libro con este ISBN.',
      );
    });
    expect(abortSignals.length).toBeGreaterThan(1);
    expect(abortSignals.some((abortSignal) => abortSignal.aborted)).toBe(true);

    abortSignals.length = 0;
    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    setInput(page, 'signal-isbn', '9780306406158');
    fixture.detectChanges();
    setInput(page, 'signal-isbn', '978-0-13-235088-4');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.querySelector('#signal-panel')?.textContent).toContain(
        'Ya existe un libro con este ISBN.',
      );
    });
    expect(abortSignals.length).toBeGreaterThan(1);
    expect(abortSignals.some((abortSignal) => abortSignal.aborted)).toBe(true);
  });

  it('accepts a unique ISBN after asynchronous validation in both labs', async () => {
    const { fixture, page, repository } = await createPage();
    fillReactiveForm(page, 'Reactive ISBN book');
    setInput(page, 'reactive-isbn', '9780306406157');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.querySelector('#reactive-panel .forms-page__pending')).toBeNull();
    });
    expect(page.querySelector('#reactive-panel .forms-page__status-pill--valid')).toBeTruthy();
    submit(page, '#reactive-panel form');
    await vi.waitFor(() => expect(repository.books()).toHaveLength(1));

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    fillSignalForm(page, 'Signal ISBN book');
    setInput(page, 'signal-isbn', '9781111111111');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(page.querySelector('#signal-panel .forms-page__pending')).toBeNull();
    });
    expect(page.querySelector('#signal-panel .forms-page__status-pill--valid')).toBeTruthy();
    submit(page, '#signal-panel form');
    await vi.waitFor(() => expect(repository.books()).toHaveLength(2));
  });

  it('saves valid Reactive Forms and ignores concurrent duplicate submits', async () => {
    const { fixture, page, repository } = await createPage();
    fillReactiveForm(page, 'A book saved reactively');
    submit(page, '#reactive-panel form');
    submit(page, '#reactive-panel form');
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(repository.books()).toHaveLength(1);
      expect(page.textContent).toContain('Libro guardado: A book saved reactively.');
    });
    expect(repository.books()[0].title).toBe('A book saved reactively');
    expect(repository.books()[0].authors).toEqual(['Ada Lovelace']);
  });

  it('saves valid Signal Forms and rejects a second concurrent submission', async () => {
    const { fixture, page, repository } = await createPage();
    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    fillSignalForm(page, 'A book saved with signals');
    submit(page, '#signal-panel form');
    submit(page, '#signal-panel form');
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(repository.books()).toHaveLength(1);
      expect(page.textContent).toContain('Libro guardado: A book saved with signals.');
    });
    expect(repository.books()[0].title).toBe('A book saved with signals');
  });

  it('does not save either form when required fields are invalid', async () => {
    const { fixture, page, repository } = await createPage();
    submit(page, '#reactive-panel form');
    fixture.detectChanges();
    expect(repository.books()).toHaveLength(0);

    page.querySelector<HTMLButtonElement>('#signal-tab')!.click();
    fixture.detectChanges();
    submit(page, '#signal-panel form');
    fixture.detectChanges();
    expect(repository.books()).toHaveLength(0);
  });
});
