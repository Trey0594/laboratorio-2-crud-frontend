import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product';
import { getErrorMessage } from '../../utils/error-message';

// Formulario reutilizable: si recibe un producto, lo actualiza; si no, crea uno nuevo.
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly productService = inject(ProductService);

  readonly product = input<Product | null>(null);
  readonly categories = input<Category[]>([]);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly isEditing = computed(() => this.product() !== null);
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor() {
    // Cada vez que cambia el producto recibido, se cargan sus datos en el formulario.
    effect(() => {
      const product = this.product();
      this.errorMessage.set('');
      this.productForm.reset({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? null,
        stock: product?.stock ?? null,
        categoryId: product?.category?.id ?? null,
      });
    });
  }

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();
    const productData: Product = {
      name: formValue.name,
      description: formValue.description,
      price: Number(formValue.price),
      stock: Number(formValue.stock),
      category: { id: Number(formValue.categoryId) },
    };

    const productToEdit = this.product();
    const request = productToEdit?.id
      ? this.productService.update(productToEdit.id, productData)
      : this.productService.create(productData);

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(getErrorMessage(error, 'No se pudo guardar el producto.'));
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
