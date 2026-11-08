export type RoleName = 'SUPER-ADMIN-ROLE' | 'USER';

export interface Role {
  id: number;
  name: RoleName;
  description: string;
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
