# Laboratorio 2 - CRUD Front-end

Aplicación en **Angular 22** que consume la API REST del Laboratorio 1 (Spring Boot + PostgreSQL). Incluye inicio de sesión, registro de usuarios, CRUD de **Productos** y **Categorías** y un listado de usuarios restringido por rol.

Estudiante: Trayce Gonzalez Brenes · Proyecto 3 · Universidad Cenfotec

## Requisitos
- Node.js 20 o superior
- El back-end del Laboratorio 1 corriendo en `http://localhost:8080`

## Cómo correrlo
```bash
npm install
npm start
```
Abrir `http://localhost:4200`.

## Usuarios de prueba (creados por el back-end)

| Rol | Email | Password |
|---|---|---|
| SUPER-ADMIN-ROLE | super.admin@gmail.com | superadmin123 |
| USER | user@gmail.com | user123 |

## Permisos

| Funcionalidad | USER | SUPER-ADMIN-ROLE |
|---|---|---|
| Ver productos y categorías | Sí | Sí |
| Crear, editar y eliminar productos y categorías | No (solo lectura) | Sí |
| Ver usuarios registrados | No | Sí |

- Para el rol `USER` los botones de crear, editar y eliminar no se muestran.
- La página de usuarios está restringida en el menú (el enlace solo aparece para el administrador) y por URL (`adminGuard` redirige si se escribe `/users` a mano).

## Estructura

```
src/app/
├── components/        Componentes reutilizables
│   ├── category-form/ Formulario para crear y editar categorías
│   ├── product-form/  Formulario para crear y editar productos
│   ├── user-list/     Tabla de usuarios
│   ├── navbar/        Menú principal según el rol
│   └── pagination/    Paginación de las tablas
├── pages/             Páginas (rutas)
│   ├── login/
│   ├── signup/
│   ├── products/
│   ├── categories/
│   └── users/
├── services/          Llamadas HTTP a la API (auth, product, category, user)
├── interfaces/        Tipos de datos
├── guards/            authGuard, adminGuard, guestGuard
├── interceptors/      Agrega el token JWT a cada petición
├── constants/         URL de la API
└── utils/             Mensajes de error
```

## Back-end
Repositorio de la API: https://github.com/Trey0594/Laboratorio1-crud-backend
