import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
    title: 'Iniciar sesión',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
    canActivate: [guestGuard],
    title: 'Registro',
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
    canActivate: [authGuard],
    title: 'Productos',
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
    canActivate: [authGuard],
    title: 'Categorías',
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users').then((m) => m.Users),
    canActivate: [authGuard, adminGuard],
    title: 'Usuarios',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
