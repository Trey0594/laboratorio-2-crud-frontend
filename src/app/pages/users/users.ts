import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Pagination } from '../../components/pagination/pagination';
import { UserList } from '../../components/user-list/user-list';
import { Meta } from '../../interfaces/api-response';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user';
import { getErrorMessage } from '../../utils/error-message';

// Página solo para SUPER-ADMIN-ROLE (protegida con adminGuard en app.routes.ts).
@Component({
  imports: [UserList, Pagination],
  selector: 'app-users',
  templateUrl: './users.html',
})
export class Users {
  private readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly meta = signal<Meta | undefined>(undefined);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    this.loadUsers();
  }

  loadUsers(page = 1): void {
    this.loading.set(true);
    this.userService.getAll(page).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(error, 'No se pudieron cargar los usuarios.'));
      },
    });
  }
}
