import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api';
import { ApiResponse } from '../interfaces/api-response';
import { User } from '../interfaces/user';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/users`;

  getAll(page = 1, size = 10): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<User[]>>(this.url, { params });
  }
}
