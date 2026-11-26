import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { BookRepository, DuplicateIsbnError } from '../book-repository';
import { BookCategory, createBookFormModel, toBookCreationDto } from '../book.model';

function nonBlank(control: AbstractControl<unknown>): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim().length > 0 ? null : { whitespace: true };
}

// Cada valor nuevo cancela la suscripción anterior; el AbortController aborta la comprobación obsoleta.
function createIsbnValidator(repository: BookRepository): AsyncValidatorFn {
  return (control) => {
    const isbn = String(control.value).trim();
    if (!isbn) {
      return of(null);
    }

    return new Observable<ValidationErrors | null>((subscriber) => {
      const abortController = new AbortController();
      void repository.isDuplicateIsbn(isbn, abortController.signal).then(
        (duplicate) => {
          if (!abortController.signal.aborted) {
            subscriber.next(duplicate ? { duplicateIsbn: true } : null);
            subscriber.complete();
          }
        },
        () => {
          if (!abortController.signal.aborted) {
            subscriber.next({ isbnCheckUnavailable: true });
            subscriber.complete();
          }
        },
      );

      return () => abortController.abort();
    });
  };
}

@Component({
  selector: 'app-reactive-form-lab',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './reactive-form-lab.html',
  styleUrl: './reactive-form-lab.scss',
})
export class ReactiveFormLab {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly repository = inject(BookRepository);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);
  protected readonly result = signal('');
  // Identificadores estables para que @for no recree los campos al eliminar uno intermedio.
  protected readonly authorIds = signal<readonly string[]>([]);

  protected readonly form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), nonBlank]],
    author: ['', [Validators.required, nonBlank]],
    category: this.formBuilder.control<BookCategory>('architecture', Validators.required),
    year: new FormControl<number | null>(this.currentYear, {
      validators: [Validators.required, Validators.min(1450), Validators.max(this.currentYear)],
    }),
    description: [''],
    isbn: this.formBuilder.control('', {
      asyncValidators: [createIsbnValidator(this.repository)],
      updateOn: 'change',
    }),
    additionalAuthors: this.formBuilder.array<FormControl<string>>([]),
  });

  protected readonly authors = this.form.controls.additionalAuthors;

  protected readonly values = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );
  protected readonly status = toSignal(this.form.statusChanges.pipe(startWith(this.form.status)), {
    initialValue: this.form.status,
  });

  protected addAuthor(): void {
    this.authors.push(this.formBuilder.control('', [Validators.required, nonBlank]));
    this.authorIds.update((ids) => [...ids, crypto.randomUUID()]);
  }

  protected removeAuthor(index: number): void {
    this.authors.removeAt(index);
    this.authorIds.update((ids) => ids.filter((_, authorIndex) => authorIndex !== index));
  }

  protected showError(control: AbstractControl): boolean {
    return (control.touched || this.submitted()) && control.invalid;
  }

  protected errorMessage(control: AbstractControl): string {
    const errors = control.errors;
    if (errors?.['required']) return 'Este campo es obligatorio.';
    if (errors?.['minlength']) return 'Escribe al menos 3 caracteres.';
    if (errors?.['min']) return 'El año debe ser 1450 o posterior.';
    if (errors?.['max']) return `El año no puede ser posterior a ${this.currentYear}.`;
    if (errors?.['whitespace']) return 'Este campo no puede contener solo espacios.';
    if (errors?.['duplicateIsbn']) return 'Ya existe un libro con este ISBN.';
    if (errors?.['isbnCheckUnavailable']) {
      return 'No se pudo comprobar el ISBN. Inténtalo de nuevo antes de guardar.';
    }
    return 'Revisa este campo.';
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.saving()) {
      return;
    }
    if (this.form.pending || this.form.invalid) {
      this.result.set(
        this.form.pending
          ? 'Espera a que termine la validación del ISBN.'
          : 'Corrige los errores antes de guardar.',
      );
      return;
    }

    this.saving.set(true);
    try {
      const book = await this.repository.save(toBookCreationDto(this.form.getRawValue()));
      this.result.set(`Libro guardado: ${book.title}.`);
    } catch (error) {
      this.result.set(
        error instanceof DuplicateIsbnError
          ? error.message
          : 'No se pudo guardar el libro. Inténtalo de nuevo.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  // setValue exige el objeto completo.
  protected loadWithSetValue(): void {
    this.authors.clear();
    this.authorIds.set([]);
    this.form.setValue({
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      category: 'architecture',
      year: 2017,
      description: 'Diseño de sistemas mantenibles.',
      isbn: '',
      additionalAuthors: [],
    });
  }

  // patchValue actualiza solo los campos indicados.
  protected updateWithPatchValue(): void {
    this.form.patchValue({ title: 'Domain-Driven Design', year: 2003 });
  }

  protected reset(): void {
    this.authors.clear();
    this.authorIds.set([]);
    this.form.reset(createBookFormModel(this.currentYear));
    this.submitted.set(false);
    this.result.set('');
  }
}
