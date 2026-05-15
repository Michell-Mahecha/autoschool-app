"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { coursesService } from "@/services/courses.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Pencil, Trash2, Eye, XCircle } from "lucide-react";

const courseSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(150, "Máximo 150 caracteres"),
  description: z.string().max(5000, "Máximo 5000 caracteres").optional(),
  duration_hours: z
    .number({ message: "La duración es obligatoria" })
    .int("La duración debe ser un número entero")
    .positive("La duración debe ser mayor que 0"),
  price: z
    .number({ message: "El precio es obligatorio" })
    .min(0, "El precio debe ser mayor o igual a 0"),
  level: z.enum(["basic", "intermediate", "advanced"], {
    message: "Selecciona un nivel válido",
  }),
  is_active: z.boolean(),
});

const defaultFormValues = {
  name: "",
  description: "",
  duration_hours: undefined,
  price: undefined,
  level: "basic",
  is_active: true,
};

const defaultFilters = {
  search: "",
  level: "",
  is_active: "",
  ordering: "-created_at",
};

function getApiError(err, fallback) {
  const data = err?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    if (Array.isArray(value)) return value[0];
    if (typeof value === "string") return value;
  }

  return fallback;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("es-CO");
}

function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value ?? "-";
  return num.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getLevelLabel(level) {
  switch (level) {
    case "basic":
      return "Básico";
    case "intermediate":
      return "Intermedio";
    case "advanced":
      return "Avanzado";
    default:
      return level;
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultFormValues,
  });

  const loadCourses = async (queryParams = filters) => {
    try {
      setIsLoading(true);
      const data = await coursesService.getCourses(queryParams);
      setCourses(data);
    } catch (err) {
      setError("Error al cargar los cursos. Verifica la conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = async () => {
    setError("");
    setSuccess("");
    await loadCourses(filters);
  };

  const handleClearFilters = async () => {
    setFilters(defaultFilters);
    setError("");
    setSuccess("");
    await loadCourses(defaultFilters);
  };

  const handleViewCourse = async (course) => {
    try {
      setError("");
      setSuccess("");
      const data = await coursesService.getCourseById(course.id);
      setSelectedCourse(data);
    } catch (err) {
      setError(getApiError(err, "No se pudo cargar el detalle del curso."));
    }
  };

  const handleEditCourse = (course) => {
    setError("");
    setSuccess("");
    setEditingCourseId(course.id);
    reset({
      name: course.name ?? "",
      description: course.description ?? "",
      duration_hours: course.duration_hours ?? undefined,
      price: course.price ?? undefined,
      level: course.level ?? "basic",
      is_active: Boolean(course.is_active),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    reset(defaultFormValues);
  };

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        ...data,
        description: data.description || "",
      };

      if (editingCourseId) {
        await coursesService.updateCourse(editingCourseId, payload);
        setSuccess("Curso actualizado correctamente.");
      } else {
        await coursesService.createCourse(payload);
        setSuccess("Curso creado correctamente.");
      }

      setEditingCourseId(null);
      reset(defaultFormValues);
      await loadCourses(filters);
    } catch (err) {
      setError(
        getApiError(
          err,
          "Error al guardar el curso. Revisa los campos e intenta nuevamente."
        )
      );
    }
  };

  const handleDeleteCourse = async (course) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el curso "${course.name}"?`
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      await coursesService.deleteCourse(course.id);
      setSuccess("Curso eliminado correctamente.");

      if (selectedCourse?.id === course.id) {
        setSelectedCourse(null);
      }

      await loadCourses(filters);
    } catch (err) {
      setError(getApiError(err, "No se pudo eliminar el curso."));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
        <p className="text-gray-500 mt-2">
          Gestiona la creación, edición, eliminación y consulta de cursos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCourseId ? "Editar curso" : "Crear curso"}
              </CardTitle>
              <CardDescription>
                {editingCourseId
                  ? "Modifica la información del curso seleccionado."
                  : "Completa el formulario para registrar un nuevo curso."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duración en horas</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    min="1"
                    step="1"
                    {...register("duration_hours", { valueAsNumber: true })}
                  />
                  {errors.duration_hours && (
                    <p className="text-sm text-red-500">
                      {errors.duration_hours.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <select
                    id="level"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register("level")}
                  >
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    className="h-4 w-4"
                    {...register("is_active")}
                  />
                  <Label htmlFor="is_active">Activo</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Guardando..."
                      : editingCourseId
                      ? "Actualizar curso"
                      : "Crear curso"}
                  </Button>

                  {editingCourseId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-500 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Éxito</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Usa filtros, búsqueda y ordenamiento sobre la API de cursos.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Buscar por nombre o descripción"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter_level">Nivel</Label>
                <select
                  id="filter_level"
                  value={filters.level}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, level: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="basic">Básico</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter_active">Estado</Label>
                <select
                  id="filter_active"
                  value={filters.is_active}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      is_active: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ordering">Ordenar por</Label>
                <select
                  id="ordering"
                  value={filters.ordering}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, ordering: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="-created_at">Más recientes</option>
                  <option value="created_at">Más antiguos</option>
                  <option value="price">Precio ascendente</option>
                  <option value="-price">Precio descendente</option>
                  <option value="duration_hours">Duración ascendente</option>
                  <option value="-duration_hours">Duración descendente</option>
                </select>
              </div>

              <div className="flex gap-2 md:col-span-2 md:items-end">
                <Button type="button" onClick={handleApplyFilters}>
                  Aplicar filtros
                </Button>
                <Button type="button" variant="outline" onClick={handleClearFilters}>
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedCourse && (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Detalle del curso</CardTitle>
                  <CardDescription>
                    Información completa del curso seleccionado.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cerrar
                </Button>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{selectedCourse.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{selectedCourse.name}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Descripción</p>
                  <p className="font-medium">
                    {selectedCourse.description || "Sin descripción"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-medium">{selectedCourse.duration_hours} horas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium">$ {formatCurrency(selectedCourse.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nivel</p>
                  <p className="font-medium">
                    {getLevelLabel(selectedCourse.level)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium">
                    {selectedCourse.is_active ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Creado en</p>
                  <p className="font-medium">
                    {formatDate(selectedCourse.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Listado de cursos</CardTitle>
              <CardDescription>
                Resultado de la consulta al endpoint <code>/api/courses/</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-gray-500 py-4">Cargando cursos...</p>
              ) : courses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No hay cursos registrados.
                </p>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell className="max-w-xs">
                            <span className="line-clamp-2">
                              {course.description || "Sin descripción"}
                            </span>
                          </TableCell>
                          <TableCell>{course.duration_hours} h</TableCell>
                          <TableCell>$ {formatCurrency(course.price)}</TableCell>
                          <TableCell>{getLevelLabel(course.level)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                course.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {course.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewCourse(course)}
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                Ver
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Pencil className="mr-1 h-4 w-4" />
                                Editar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCourse(course)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}