import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error HTTP en un mensaje entendible para mostrar en pantalla.
export function getErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifique que el back-end esté corriendo.';
  }
  if (error.status === 403) {
    return 'No tiene permisos para realizar esta acción.';
  }
  return error.error?.message ?? fallback;
}
