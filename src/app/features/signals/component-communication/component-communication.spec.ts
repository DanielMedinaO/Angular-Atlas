import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { EXAMPLE_BOOK } from './book.model';
import { ComponentCommunicationComponent } from './component-communication';

describe('ComponentCommunicationComponent', () => {
  let fixture: ComponentFixture<ComponentCommunicationComponent>;

  const root = () => fixture.nativeElement as HTMLElement;
  const addButton = () => root().querySelector<HTMLButtonElement>('.book-card__add')!;
  const favoriteButton = () => root().querySelector<HTMLButtonElement>('.favorite-toggle')!;
  const listItems = () =>
    Array.from(root().querySelectorAll('.communication__list li')).map((el) =>
      el.textContent?.trim(),
    );

  async function click(button: HTMLButtonElement): Promise<void> {
    button.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCommunicationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentCommunicationComponent);
    await fixture.whenStable();
  });

  it('should render the child components with the example book', () => {
    expect(root().querySelector('app-book-card')).toBeTruthy();
    expect(root().querySelector('app-favorite-toggle')).toBeTruthy();
    expect(root().querySelector('.book-card__title')?.textContent).toContain(EXAMPLE_BOOK.title);
    expect(root().querySelector('.communication__empty')).toBeTruthy();
  });

  it('should add the book id received through the event to the reading list', async () => {
    await click(addButton());

    expect(fixture.componentInstance['readingList']()).toEqual([EXAMPLE_BOOK.id]);
    expect(listItems()).toEqual([EXAMPLE_BOOK.id]);
    expect(root().querySelector('[role="status"]')?.textContent).toContain('añadido');
  });

  it('should not allow duplicated books in the reading list', async () => {
    await click(addButton());
    await click(addButton());
    await click(addButton());

    expect(fixture.componentInstance['readingList']()).toEqual([EXAMPLE_BOOK.id]);
    expect(listItems()).toHaveLength(1);
    expect(root().querySelector('[role="status"]')?.textContent).toContain('ya estaba');
  });

  it('should not mutate the previous reading list array', async () => {
    const before = fixture.componentInstance['readingList']();

    await click(addButton());

    expect(before).toEqual([]);
    expect(fixture.componentInstance['readingList']()).not.toBe(before);
  });

  it('should clear the reading list', async () => {
    await click(addButton());
    await click(root().querySelector<HTMLButtonElement>('.communication__clear')!);

    expect(fixture.componentInstance['readingList']()).toEqual([]);
    expect(root().querySelector('.communication__empty')).toBeTruthy();
  });

  it('should keep isFavorite in sync with the toggle in both directions', async () => {
    const isFavorite = fixture.componentInstance['isFavorite'];

    await click(favoriteButton());
    expect(isFavorite()).toBe(true);
    expect(root().querySelector('.communication__metric dd')?.textContent).toContain('Sí');

    isFavorite.set(false);
    await fixture.whenStable();
    expect(favoriteButton().getAttribute('aria-pressed')).toBe('false');
    expect(root().querySelector('.communication__metric dd')?.textContent).toContain('No');
  });
});
