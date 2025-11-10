import { z } from 'zod';

/**
 * Esquemas de validación con Zod
 * 
 * Qué hace
 * - Define la estructura y reglas de validación para cada endpoint
 * - Valida tipos, formatos, rangos, etc.
 * - Proporciona mensajes de error claros
 */

// Esquemas de Autenticación
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

// Esquemas de Usuarios
export const createUsuarioSchema = z.object({
    nombre_completo: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.enum(['estudiante', 'profesor', 'administrador'], {
        errorMap: () => ({ message: 'Rol inválido' }),
    } as any),
    estado: z.enum(['activo', 'inactivo']).optional(),
});

export const updateUsuarioSchema = z.object({
    nombre_completo: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    email: z.string().email('Email inválido').optional(),
    contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    rol: z.enum(['estudiante', 'profesor', 'administrador']).optional(),
    estado: z.enum(['activo', 'inactivo']).optional(),
});

// Esquemas de Cursos
export const createCursoSchema = z.object({
    codigo_curso: z.string().min(1, 'El código de curso es requerido'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: z.string().optional(),
    creditos: z.number().int().positive('Los créditos deben ser un número positivo'),
    horas_semanales: z.number().int().positive('Las horas semanales deben ser un número positivo'),
    nivel: z.string().min(1, 'El nivel es requerido'),
});

export const updateCursoSchema = z.object({
    codigo_curso: z.string().min(1).optional(),
    nombre: z.string().min(2).optional(),
    descripcion: z.string().optional(),
    creditos: z.number().int().positive().optional(),
    horas_semanales: z.number().int().positive().optional(),
    nivel: z.string().min(1).optional(),
});

// Esquemas de Estudiantes
export const createEstudianteSchema = z.object({
    usuario_id: z.number().int().positive('ID de usuario inválido'),
    codigo_estudiante: z.string().min(1, 'El código de estudiante es requerido'),
    carrera: z.string().min(2, 'La carrera debe tener al menos 2 caracteres'),
    semestre: z.number().int().min(1).max(20, 'El semestre debe estar entre 1 y 20'),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
});

export const updateEstudianteSchema = z.object({
    codigo_estudiante: z.string().min(1).optional(),
    carrera: z.string().min(2).optional(),
    semestre: z.number().int().min(1).max(20).optional(),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
});

// Esquemas de Profesores
export const createProfesorSchema = z.object({
    usuario_id: z.number().int().positive('ID de usuario inválido'),
    codigo_profesor: z.string().min(1, 'El código de profesor es requerido'),
    departamento: z.string().min(2, 'El departamento debe tener al menos 2 caracteres'),
    especialidad: z.string().optional(),
    titulo: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
});

export const updateProfesorSchema = z.object({
    codigo_profesor: z.string().min(1).optional(),
    departamento: z.string().min(2).optional(),
    especialidad: z.string().optional(),
    titulo: z.string().min(2).optional(),
});

// Esquemas de Matrículas
export const createMatriculaSchema = z.object({
    estudiante_id: z.number().int().positive('ID de estudiante inválido'),
    curso_id: z.number().int().positive('ID de curso inválido'),
    semestre: z.string().min(1, 'El semestre es requerido'),
    estado: z.enum(['matriculado', 'pendiente', 'cancelado', 'completado']).optional(),
    nota_final: z.number().min(0).max(20).optional(),
});

export const updateMatriculaSchema = z.object({
    estudiante_id: z.number().int().positive().optional(),
    curso_id: z.number().int().positive().optional(),
    semestre: z.string().min(1).optional(),
    estado: z.enum(['matriculado', 'pendiente', 'cancelado', 'completado']).optional(),
    nota_final: z.number().min(0).max(20).optional(),
});

// Esquemas de Asistencia
export const createAsistenciaSchema = z.object({
    matricula_id: z.number().int().positive('ID de matrícula inválido'),
    codigo_qr: z.string().min(1, 'El código QR es requerido'),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    hora_entrada: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    estado: z.enum(['presente', 'ausente', 'tardio'], {
        errorMap: () => ({ message: 'Estado inválido' }),
    } as any),
    observaciones: z.string().optional(),
});

export const updateAsistenciaSchema = z.object({
    matricula_id: z.number().int().positive().optional(),
    codigo_qr: z.string().min(1).optional(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    hora_entrada: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    estado: z.enum(['presente', 'ausente', 'tardio']).optional(),
    observaciones: z.string().optional(),
});

// Esquemas de Exámenes
export const createExamenSchema = z.object({
    curso_id: z.number().int().positive('ID de curso inválido'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    tipo: z.enum(['parcial', 'final', 'simulacro', 'quiz'], {
        errorMap: () => ({ message: 'Tipo de examen inválido' }),
    } as any),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    hora_inicio: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    duracion_minutos: z.number().int().positive('La duración debe ser un número positivo'),
    estado: z.enum(['programado', 'completado', 'cancelado']).optional(),
    puntaje_total: z.number().positive('El puntaje total debe ser un número positivo'),
});

export const updateExamenSchema = z.object({
    curso_id: z.number().int().positive().optional(),
    nombre: z.string().min(2).optional(),
    tipo: z.enum(['parcial', 'final', 'simulacro', 'quiz']).optional(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    hora_inicio: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    duracion_minutos: z.number().int().positive().optional(),
    estado: z.enum(['programado', 'completado', 'cancelado']).optional(),
    puntaje_total: z.number().positive().optional(),
});

// Esquemas de Resultados de Examen
export const createResultadoExamenSchema = z.object({
    matricula_id: z.number().int().positive('ID de matrícula inválido'),
    puntaje_obtenido: z.number().min(0, 'El puntaje no puede ser negativo'),
    fecha_presentacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    estado: z.enum(['presentado', 'ausente', 'reprobado']).optional(),
});

// Esquemas de Carnets
export const createCarnetSchema = z.object({
    usuario_id: z.number().int().positive('ID de usuario inválido'),
    codigo_carnet: z.string().min(1, 'El código de carnet es requerido'),
    codigo_qr: z.string().optional(),
    fecha_expedicion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    estado: z.enum(['activo', 'vencido', 'suspendido']).optional(),
});

export const updateCarnetSchema = z.object({
    usuario_id: z.number().int().positive().optional(),
    codigo_carnet: z.string().min(1).optional(),
    codigo_qr: z.string().optional(),
    fecha_expedicion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    estado: z.enum(['activo', 'vencido', 'suspendido']).optional(),
});

// Esquemas para parámetros de ruta
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

