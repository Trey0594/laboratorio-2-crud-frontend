import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { CategoryForm } from '../../components/category-form/category-form';
import { Pagination } from '../../components/pagination/pagination';
import { Meta } from '../../interfaces/api-response';
import { Category } from '../../interfaces/category';
import { AuthService } from '../../services/auth';
import { CategoryService } from '../../services/category';
import { getErrorMessage } from '../../utils/error-message';
import { pastelClass } from '../../utils/pastel';

@Component({
  imports: [CategoryForm, Pagination],
  selector: 'app-categories',
  templateUrl: './categories.html',
  host: { '(document:keydown.escape)': 'closeForm()' },
})
export class Categories {
  private readonly categoryService = inject(CategoryService);
  protected readonly authService = inject(AuthService);

  readonly categories = signal<Category[]>([]);
  readonly meta = signal<Meta | undefined>(undefined);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  // Controlan el formulario reutilizable: null = crear, una categoría = editar.
  readonly showForm = signal(false);
  readonly selectedCategory = signal<Category | null>(null);

  protected readonly pastelClass = pastelClass;
  private currentPage = 1;
  private messageTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.loadCategories();
  }

  loadCategories(page = this.currentPage): void {
    this.currentPage = page;
    this.loading.set(true);
    this.categoryService.getAll(page).subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(error, 'No se pudieron cargar las categorías.'));
      },
    });
  }

  openCreateForm(): void {
    this.clearMessages();
    this.selectedCategory.set(null);
    this.showForm.set(true);
  }

  openEditForm(category: Category): void {
    this.clearMessages();
    this.selectedCategory.set(category);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedCategory.set(null);
  }

  onSaved(): void {
    const wasEditing = this.selectedCategory() !== null;
    this.closeForm();
    this.showSuccess(wasEditing ? 'Categoría actualizada.' : 'Categoría creada.');
    this.loadCategories();
  }

  deleteCategory(category: Category): void {
    if (!category.id || !confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      return;
    }

    this.clearMessages();
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.showSuccess('Categoría eliminada.');
        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.status === 409
            ? 'No se puede eliminar: la categoría tiene productos asignados.'
            : getErrorMessage(error, 'No se pudo eliminar la categoría.'),
        );
      },
    });
  }

  // El mensaje de éxito desaparece solo después de unos segundos.
  private showSuccess(message: string): void {
    clearTimeout(this.messageTimer);
    this.successMessage.set(message);
    this.messageTimer = setTimeout(() => this.successMessage.set(''), 3000);
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
