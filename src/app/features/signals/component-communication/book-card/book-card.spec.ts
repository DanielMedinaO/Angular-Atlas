import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Book, EXAMPLE_BOOK } from '../book.model';
import { BookCardComponent } from './book-card';

@Component({
  imports: [BookCardComponent],
  template: `<app-book-card [book]="book()" (addRequested)="received.push($event)" />`,
})
class HostComponent {
  readonly book = signal<Book>(EXAMPLE_BOOK);
  readonly received: string[] = [];
}

describe('BookCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent, HostComponent],
    }).compileComponents();
  });

  it('should render the title, author and description of the received book', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.book-card__title')?.textContent).toContain(EXAMPLE_BOOK.title);
    expect(root.querySelector('.book-card__author')?.textContent).toContain(EXAMPLE_BOOK.author);
    expect(root.querySelector('.book-card__description')?.textContent).toContain(
      EXAMPLE_BOOK.description,
    );
  });

  it('should re-render when the parent passes a different book', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();

    fixture.componentInstance.book.set({ ...EXAMPLE_BOOK, id: 'other', title: 'Otro libro' });
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.book-card__title')?.textContent,
    ).toContain('Otro libro');
  });

  it('should not allow the required book input to be omitted', () => {
    const fixture = TestBed.createComponent(BookCardComponent);

    // Leer un input.required() que nunca se enlazó lanza NG0950 en tiempo de ejecución;
    // en una plantilla, omitir [book] ya es un error de compilación.
    expect(() => fixture.componentInstance.book()).toThrowError(/NG0950/);
  });

  it('should emit the book id through addRequested when the button is clicked', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.received).toEqual([EXAMPLE_BOOK.id]);
  });
});
