# AutoSchool API

Backend de la aplicación AutoSchool construido con Django REST Framework.

## Pasos para ejecutar el proyecto

Sigue estas instrucciones para configurar y levantar el proyecto localmente.

### 1. Crear entorno virtual

Desde la carpeta `backend/`, crea un entorno virtual de Python:

```bash
python -m venv .venv
```

*(Si estás en macOS/Linux y el comando anterior no funciona, intenta usar `python3 -m venv .venv`)*

### 2. Activar entorno virtual

Activa el entorno virtual:

- En macOS/Linux:
  ```bash
  source .venv/bin/activate
  ```
- En Windows:
  ```bash
  .venv\Scripts\activate
  ```

### 3. Instalar dependencias

Con el entorno virtual activado, instala las dependencias usando el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 4. Ejecutar migraciones

Aplica las migraciones a la base de datos (SQLite por defecto) para crear todas las tablas necesarias:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crear superusuario

Crea un administrador para acceder al panel de Django:

```bash
python manage.py createsuperuser
```
Te pedirá un nombre de usuario, correo electrónico (opcional) y una contraseña.

### 6. Levantar servidor

Inicia el servidor de desarrollo local:

```bash
python manage.py runserver
```

El servidor estará corriendo en `http://127.0.0.1:8000/`.

### 7. Entrar al admin

Puedes acceder al panel de administración de Django en:
[http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

Ahí podrás iniciar sesión con el superusuario que creaste y gestionar los modelos (Students, Instructors, Courses, etc.).

### 8. Entrar a Swagger (Documentación de la API)

La documentación interactiva de los endpoints se genera automáticamente. Puedes verla y probarla en:
[http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

Si prefieres la vista de ReDoc, puedes acceder a:
[http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)

### 9. Probar endpoints principales

Los endpoints principales disponibles bajo `/api/` son:

- **Estudiantes**: `GET /api/students/`
- **Instructores**: `GET /api/instructors/`
- **Vehículos**: `GET /api/vehicles/`
- **Cursos**: `GET /api/courses/`
- **Inscripciones (Enrollments)**: `GET /api/enrollments/`
- **Clases (Lessons)**: `GET /api/lessons/`

Desde la vista de Swagger (`/api/docs/`) puedes probar las operaciones CRUD completas (GET, POST, PUT, PATCH, DELETE) para cada uno de estos recursos.
