import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Pagination } from '../../components/pagination/pagination';
import { ProductForm } from '../../components/product-form/product-form';
import { Meta } from '../../interfaces/api-response';
import { Category } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { AuthService } from '../../services/auth';
import { CategoryService } from '../../services/category';
import { ProductService } from '../../services/product';
import { getErrorMessage } from '../../utils/error-message';
import { pastelClass } from '../../utils/pastel';

@Component({
  imports: [ProductForm, Pagination, CurrencyPipe],
  selector: 'app-products',
  templateUrl: './products.html',
  host: { '(document:keydown.escape)': 'closeForm()' },
})
export class Products {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  protected readonly authService = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly meta = signal<Meta | undefined>(undefined);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  // Controlan el formulario reutilizable: null = crear, un producto = editar.
  readonly showForm = signal(false);
  readonly selectedProduct = signal<Product | null>(null);

  protected readonly pastelClass = pastelClass;
  private currentPage = 1;
  private messageTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.loadProducts();
  }

  loadProducts(page = this.currentPage): void {
    this.currentPage = page;
    this.loading.set(true);
    this.productService.getAll(page).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(error, 'No se pudieron cargar los productos.'));
      },
    });
  }

  openCreateForm(): void {
    this.clearMessages();
    this.selectedProduct.set(null);
    this.loadCategoriesAndShowForm();
  }

  openEditForm(product: Product): void {
    this.clearMessages();
    this.selectedProduct.set(product);
    this.loadCategoriesAndShowForm();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  onSaved(): void {
    const wasEditing = this.selectedProduct() !== null;
    this.closeForm();
    this.showSuccess(wasEditing ? 'Producto actualizado.' : 'Producto creado.');
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (!product.id || !confirm(`¿Eliminar el producto "${product.name}"?`)) {
      return;
    }

    this.clearMessages();
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.showSuccess('Producto eliminado.');
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(getErrorMessage(error, 'No se pudo eliminar el producto.'));
      },
    });
  }

  // El select del formulario necesita todas las categorías, no solo una página.
  private loadCategoriesAndShowForm(): void {
    this.categoryService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.showForm.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(getErrorMessage(error, 'No se pudieron cargar las categorías.'));
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
