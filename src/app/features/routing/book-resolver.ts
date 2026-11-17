import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { BOOKS, Book } from './book.model';

export const bookResolver: ResolveFn<Book> = (route) => {
  const book = BOOKS.find((item) => item.id === route.paramMap.get('id'));

  if (book) {
    return book;
  }

  return new RedirectCommand(inject(Router).parseUrl('/routing/books'));
};
