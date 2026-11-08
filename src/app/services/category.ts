import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api';
import { ApiResponse } from '../interfaces/api-response';
import { Category } from '../interfaces/category';

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/categories`;

  getAll(page = 1, size = 10): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<Category[]>>(this.url, { params });
  }

  create(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.url, category);
  }

  update(id: number, category: Category): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.url}/${id}`, category);
  }

  delete(id: number): Observable<ApiResponse<Category>> {
    return this.http.delete<ApiResponse<Category>>(`${this.url}/${id}`);
  }
}
