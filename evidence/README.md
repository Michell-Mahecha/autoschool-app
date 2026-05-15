# Evidencias — Módulo de Cursos (Full Stack)

## Integrantes
- Michell Mahecha
- Albert Barbosa

## Funcionalidades implementadas

### Backend (Django REST Framework)

- **Modelo `Course`** con los campos: `name`, `description`, `duration_hours`, `price`, `level`, `is_active` y `created_at`.
- **Campo `level`** con opciones predefinidas: `basic`, `intermediate` y `advanced`.
- **Serializer `CourseSerializer`** con validaciones:
  - `name` no puede estar vacío.
  - `duration_hours` debe ser mayor que 0.
  - `price` debe ser mayor o igual a 0.
- **ViewSet `CourseViewSet`** basado en `ModelViewSet` que expone los endpoints:
  - `GET /api/courses/` — Listar cursos
  - `POST /api/courses/` — Crear curso
  - `GET /api/courses/{id}/` — Ver detalle
  - `PUT /api/courses/{id}/` — Editar curso completo
  - `PATCH /api/courses/{id}/` — Editar curso parcial
  - `DELETE /api/courses/{id}/` — Eliminar curso
- **Filtros** por `level` e `is_active`.
- **Búsqueda** por `name` y `description`.
- **Ordenamiento** por `price`, `duration_hours` y `created_at`.
- **Migraciones** correctamente generadas y aplicadas.
- **Swagger/OpenAPI** con el endpoint `/api/courses/` documentado.

### Frontend (Next.js / React)

- **Vista `/dashboard/courses`** con gestión completa de cursos.
- **Listado de cursos** consumido desde `GET /api/courses/`, mostrando: nombre, descripción, duración, precio, nivel y estado.
- **Formulario de creación y edición** usando **React Hook Form** con validaciones visibles para el usuario.
- **Creación** de cursos mediante `POST /api/courses/`.
- **Edición** de cursos mediante `PUT /api/courses/{id}/`.
- **Eliminación** de cursos mediante `DELETE /api/courses/{id}/` con confirmación previa.
- **Vista de detalle** de un curso individual mediante `GET /api/courses/{id}/`.
- **Filtros desde el frontend**: búsqueda por nombre/descripción, filtro por nivel, filtro por estado activo/inactivo y ordenamiento.
- **Manejo de estados** de carga y error con mensajes visibles al usuario.
- **Componentes reutilizables** de UI: `Button`, `Card`, `Table`, `Input`, `Label`, `Alert`.
