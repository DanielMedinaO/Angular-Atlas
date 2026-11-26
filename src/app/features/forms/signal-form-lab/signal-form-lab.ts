import { JsonPipe } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import {
  FieldTree,
  FormField,
  FormRoot,
  form,
  max,
  min,
  minLength,
  required,
  schema,
  validate,
  validateAsync,
  validateTree,
} from '@angular/forms/signals';
import { BookRepository, DuplicateIsbnError } from '../book-repository';
import { BookFormModel, createBookFormModel, toBookCreationDto } from '../book.model';

@Component({
  selector: 'app-signal-form-lab',
  imports: [FormField, FormRoot, JsonPipe],
  templateUrl: './signal-form-lab.html',
  styleUrl: './signal-form-lab.scss',
})
export class SignalFormLab {
  private readonly repository = inject(BookRepository);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly submitted = signal(false);
  protected readonly result = signal('');
  // Identificadores estables para que @for no recree los campos al eliminar uno intermedio.
  protected readonly authorIds = signal<readonly string[]>([]);

  // El modelo signal es la fuente de verdad; form() crea el FieldTree sobre él.
  protected readonly model = signal(createBookFormModel(this.currentYear));

  // Reglas de negocio declaradas en un esquema reutilizable.
  private readonly bookSchema = schema<BookFormModel>((path) => {
    required(path.title, { message: 'El título es obligatorio.' });
    minLength(path.title, 3, { message: 'Escribe al menos 3 caracteres.' });
    validate(path.title, (context) =>
      context.value().trim()
        ? undefined
        : { kind: 'whitespace', message: 'El título no puede contener solo espacios.' },
    );
    required(path.author, { message: 'El autor es obligatorio.' });
    validate(path.author, (context) =>
      context.value().trim()
        ? undefined
        : { kind: 'whitespace', message: 'El autor no puede contener solo espacios.' },
    );
    required(path.category, { message: 'Selecciona una categoría.' });
    required(path.year, { message: 'El año es obligatorio.' });
    min(path.year, 1450, { message: 'El año debe ser 1450 o posterior.' });
    max(path.year, this.currentYear, {
      message: `El año no puede ser posterior a ${this.currentYear}.`,
    });
    validateTree(path.additionalAuthors, (context) =>
      context.value().flatMap((author, index) => {
        const fieldTree = context.fieldTree[index];
        return author.trim() || !fieldTree
          ? []
          : [
              {
                fieldTree,
                kind: 'required',
                message: 'El nombre del autor adicional es obligatorio.',
              },
            ];
      }),
    );
    // validateAsync encaja con un repositorio local: resource() aborta las comprobaciones obsoletas.
    validateAsync(path.isbn, {
      params: (context) => {
        const isbn = context.value().trim();
        return isbn ? { isbn } : undefined;
      },
      factory: (params) =>
        resource({
          params: () => params(),
          loader: ({ params: request, abortSignal }) =>
            this.repository.isDuplicateIsbn(request.isbn, abortSignal),
        }),
      onSuccess: (duplicate) =>
        duplicate
          ? [{ kind: 'duplicateIsbn', message: 'Ya existe un libro con este ISBN.' }]
          : undefined,
      onError: () => [
        {
          kind: 'isbnCheckUnavailable',
          message: 'No se pudo comprobar el ISBN. Inténtalo de nuevo antes de guardar.',
        },
      ],
    });
  });

  // 'none' impide ejecutar la acción mientras haya validaciones pendientes;
  // submit() además rechaza envíos concurrentes (submitting()).
  protected readonly bookForm = form(this.model, this.bookSchema, {
    submission: {
      ignoreValidators: 'none',
      onInvalid: () => this.submitted.set(true),
      action: async () => {
        this.submitted.set(true);
        try {
          const book = await this.repository.save(toBookCreationDto(this.model()));
          this.result.set(`Libro guardado: ${book.title}.`);
          return undefined;
        } catch (error) {
          const message =
            error instanceof DuplicateIsbnError
              ? error.message
              : 'No se pudo guardar el libro. Inténtalo de nuevo.';
          this.result.set(message);
          return [{ kind: 'saveFailed', message }];
        }
      },
    },
  });

  protected addAuthor(): void {
    this.model.update((model) => ({
      ...model,
      additionalAuthors: [...model.additionalAuthors, ''],
    }));
    this.authorIds.update((ids) => [...ids, crypto.randomUUID()]);
  }

  protected removeAuthor(index: number): void {
    this.model.update((model) => ({
      ...model,
      additionalAuthors: model.additionalAuthors.filter((_, authorIndex) => authorIndex !== index),
    }));
    this.authorIds.update((ids) => ids.filter((_, authorIndex) => authorIndex !== index));
  }

  protected errors<T>(field: FieldTree<T>): readonly string[] {
    if (!this.submitted() && !field().touched()) {
      return [];
    }
    return field()
      .errors()
      .map((error) => error.message ?? 'Revisa este campo.');
  }
}
