# AutoSchool Frontend

Frontend desarrollado en Next.js con React, diseñado para consumir la API de AutoSchool.

## Requisitos previos

- Node.js (v18 o superior)
- Backend de Django de AutoSchool corriendo localmente.

## Configuración inicial

### 1. Variables de entorno

Crea un archivo `.env` en la raíz de la carpeta `frontend/` y asegúrate de configurar la URL base del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

*(Puedes copiar el archivo `.env.example` proporcionado).*

### 2. Instalar dependencias

Abre la terminal en la carpeta `frontend/` y ejecuta:

```bash
npm install
```

### 3. Correr el proyecto

Para levantar el entorno de desarrollo del frontend, ejecuta:

```bash
npm run dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

## Rutas disponibles

- `/login` : Formulario de inicio de sesión mock (falso).
- `/dashboard` : Panel principal de bienvenida.
- `/dashboard/students` : Gestión de estudiantes (Listado en tabla y formulario de registro).

## Flujo de Login Mock

La plataforma incluye un flujo simulado para propósitos académicos:
1. Accede a `http://localhost:3000/login`.
2. Ingresa cualquier correo y contraseña.
3. Al hacer clic en "Iniciar sesión", el sistema te redirigirá automáticamente al `/dashboard` sin enviar los datos a la API (no hay validación real de backend).

## ¿Cómo poblar estudiantes desde el backend?

Para probar el listado de estudiantes, puedes generar data falsa (mock) directamente en el backend. 

Abre una terminal en tu carpeta `backend/` (con tu entorno virtual activado) y ejecuta el siguiente script:

```bash
python manage.py seed_students
```

Esto generará automáticamente 10 estudiantes en tu base de datos SQLite y los podrás visualizar en el frontend navegando a `/dashboard/students`.
