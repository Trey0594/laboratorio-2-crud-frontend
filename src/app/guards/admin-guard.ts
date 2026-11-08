import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Solo deja pasar al rol SUPER-ADMIN-ROLE. Protege la ruta aunque se escriba la URL a mano.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin() ? true : router.createUrlTree(['/products']);
};
