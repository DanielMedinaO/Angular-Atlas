import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BOOK_CATALOG } from './book-catalog';
import { BookExplorer, CATEGORY_STORAGE_KEY } from './book-explorer';

describe('BookExplorer', () => {
  let fixture: ComponentFixture<BookExplorer>;

  const root = () => fixture.nativeElement as HTMLElement;
  const titles = () =>
    Array.from(root().querySelectorAll('.explorer__item-title')).map((el) => el.textContent?.trim());
  const selectedTitle = () => root().querySelector('.explorer__card-title')?.textContent?.trim();
  const count = () => root().querySelector('.explorer__count-value')?.textContent?.trim();

  async function create(): Promise<void> {
    fixture = TestBed.createComponent(BookExplorer);
    await fixture.whenStable();
  }

  async function search(term: string): Promise<void> {
    const input = root().querySelector<HTMLInputElement>('#explorer-search')!;
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function chooseCategory(category: string): Promise<void> {
    const select = root().querySelector<HTMLSelectElement>('#explorer-category')!;
    select.value = category;
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
  }

  async function clickBook(title: string): Promise<void> {
    const button = Array.from(root().querySelectorAll<HTMLButtonElement>('.explorer__item')).find(
      (item) => item.textContent?.includes(title),
    );
    button!.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [BookExplorer] }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should show the whole catalog initially', async () => {
    await create();

    expect(titles()).toHaveLength(BOOK_CATALOG.length);
    expect(titles()[0]).toBe(BOOK_CATALOG[0].title);
    expect(root().querySelector('.explorer__empty')).toBeNull();
  });

  it('should filter the books by the search term', async () => {
    await create();
    await search('rxjs');

    expect(titles()).toEqual(['Reactive Programming with RxJS']);
  });

  it('should ignore case and accents when searching', async () => {
    await create();
    await search('CATALOGO');

    expect(titles()).toEqual(['Design Patterns']);
  });

  it('should filter the books by category', async () => {
    await create();
    await chooseCategory('Pruebas');

    expect(titles()).toEqual([
      'Test-Driven Development: By Example',
      'Unit Testing Principles, Practices, and Patterns',
    ]);
  });

  it('should combine the search term and the category', async () => {
    await create();
    await chooseCategory('TypeScript');
    await search('programming');

    expect(titles()).toEqual(['Programming TypeScript']);
  });

  it('should reflect the number of results in the counter', async () => {
    await create();
    expect(count()).toBe('12 resultados');

    await chooseCategory('Reactividad');
    expect(count()).toBe('1 resultado');

    await search('no-existe');
    expect(count()).toBe('0 resultados');
    expect(fixture.componentInstance['resultCount']()).toBe(0);
  });

  it('should select the first result and allow manual selection', async () => {
    await create();
    expect(selectedTitle()).toBe('Pro Angular');

    await clickBook('Clean Code');

    expect(selectedTitle()).toBe('Clean Code');
    const pressed = root().querySelectorAll('.explorer__item[aria-pressed="true"]');
    expect(pressed).toHaveLength(1);
  });

  it('should keep the selected book while it is still in the results', async () => {
    await create();
    await clickBook('Effective TypeScript');

    await search('typescript');

    expect(titles()[0]).toBe('Angular Development with TypeScript');
    expect(selectedTitle()).toBe('Effective TypeScript');
  });

  it('should select the first valid result when the selected book disappears', async () => {
    await create();
    await clickBook('Pro Angular');

    await chooseCategory('Pruebas');

    expect(selectedTitle()).toBe('Test-Driven Development: By Example');
    expect(fixture.componentInstance['selectedBook']()?.id).toBe(11);
  });

  it('should have no selected book when there are no results', async () => {
    await create();
    await search('zzzz');

    expect(fixture.componentInstance['selectedBook']()).toBeNull();
    expect(root().querySelector('.explorer__card')).toBeNull();
  });

  it('should show the empty state and recover after resetting the filters', async () => {
    await create();
    await search('zzzz');

    expect(root().querySelector('.explorer__empty')?.textContent).toContain(
      'No se encontraron libros',
    );
    expect(root().querySelector('.explorer__list')).toBeNull();

    root().querySelector<HTMLButtonElement>('.explorer__reset')!.click();
    await fixture.whenStable();

    expect(root().querySelector('.explorer__empty')).toBeNull();
    expect(titles()).toHaveLength(BOOK_CATALOG.length);
  });

  it('should save the category in localStorage when it changes', async () => {
    await create();
    await chooseCategory('Rendimiento');

    expect(localStorage.getItem(CATEGORY_STORAGE_KEY)).toBe('Rendimiento');
  });

  it('should restore a valid stored category on load', async () => {
    localStorage.setItem(CATEGORY_STORAGE_KEY, 'Angular');
    await create();

    expect(root().querySelector<HTMLSelectElement>('#explorer-category')!.value).toBe('Angular');
    expect(titles()).toEqual(['Pro Angular', 'Angular Development with TypeScript']);
  });

  it('should ignore an invalid stored category', async () => {
    localStorage.setItem(CATEGORY_STORAGE_KEY, 'Categoría inventada');
    await create();

    expect(root().querySelector<HTMLSelectElement>('#explorer-category')!.value).toBe('Todas');
    expect(titles()).toHaveLength(BOOK_CATALOG.length);
  });

  it('should keep working when localStorage is not available', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    await create();
    await chooseCategory('Angular');

    expect(titles()).toHaveLength(2);
  });
});
