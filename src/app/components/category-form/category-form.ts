import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category';
import { getErrorMessage } from '../../utils/error-message';

// Formulario reutilizable: si recibe una categoría, la actualiza; si no, crea una nueva.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-category-form',
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private readonly categoryService = inject(CategoryService);

  readonly category = input<Category | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly isEditing = computed(() => this.category() !== null);
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  categoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
  });

  constructor() {
    // Cada vez que cambia la categoría recibida, se cargan sus datos en el formulario.
    effect(() => {
      const category = this.category();
      this.errorMessage.set('');
      this.categoryForm.reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
      });
    });
  }

  submit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryData: Category = this.categoryForm.getRawValue();
    const categoryToEdit = this.category();
    const request = categoryToEdit?.id
      ? this.categoryService.update(categoryToEdit.id, categoryData)
      : this.categoryService.create(categoryData);

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(getErrorMessage(error, 'No se pudo guardar la categoría.'));
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
