import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants/api';
import { ApiResponse } from '../interfaces/api-response';
import { LoginRequest, LoginResponse, SignupRequest } from '../interfaces/auth';
import { User } from '../interfaces/user';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';
const EXPIRES_KEY = 'expires_at';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(this.readStorage(TOKEN_KEY));
  private readonly userSignal = signal<User | null>(this.readUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.tokenSignal() !== null && !this.isExpired());
  readonly isAdmin = computed(() => this.userSignal()?.role?.name === 'SUPER-ADMIN-ROLE');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  signup(newUser: SignupRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${API_URL}/auth/signup`, newUser);
  }

  logout(): void {
    this.removeStorage(TOKEN_KEY);
    this.removeStorage(USER_KEY);
    this.removeStorage(EXPIRES_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(response: LoginResponse): void {
    const expiresAt = Date.now() + response.expiresIn;
    this.writeStorage(TOKEN_KEY, response.token);
    this.writeStorage(USER_KEY, JSON.stringify(response.authUser));
    this.writeStorage(EXPIRES_KEY, String(expiresAt));
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.authUser);
  }

  private isExpired(): boolean {
    const expiresAt = Number(this.readStorage(EXPIRES_KEY));
    return !expiresAt || Date.now() > expiresAt;
  }

  private readUser(): User | null {
    const storedUser = this.readStorage(USER_KEY);
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  }

  private readStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Si el navegador bloquea localStorage, la sesión queda solo en memoria.
    }
  }

  private removeStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nada que limpiar.
    }
  }
}
