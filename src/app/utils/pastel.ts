// Asigna siempre el mismo color pastel a un mismo id (por ejemplo, a cada categoría).
export function pastelClass(id: number | undefined): string {
  return `pill-${(id ?? 0) % 6}`;
}

// Iniciales para el avatar del usuario.
export function initials(name: string, lastname: string): string {
  return `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}
