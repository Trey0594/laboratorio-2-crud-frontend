import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api';
import { ApiResponse } from '../interfaces/api-response';
import { Product } from '../interfaces/product';

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/products`;

  getAll(page = 1, size = 10): Observable<ApiResponse<Product[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<Product[]>>(this.url, { params });
  }

  create(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url, product);
  }

  update(id: number, product: Product): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.url}/${id}`, product);
  }

  delete(id: number): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(`${this.url}/${id}`);
  }
}
