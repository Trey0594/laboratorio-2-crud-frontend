import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { initials } from '../../utils/pastel';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly authService = inject(AuthService);

  readonly userInitials = computed(() => {
    const user = this.authService.currentUser();
    return user ? initials(user.name, user.lastname) : '';
  });

  logout(): void {
    this.authService.logout();
  }
}
