import { z } from 'zod';

/**
 * Schema de validación para crear/actualizar exámenes
 */
export const examenSchema = z.object({
    curso_id: z
        .number()
        .int('ID de curso inválido')
        .positive('El ID de curso debe ser positivo'),
    
    nombre: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    
    tipo: z.enum(['parcial', 'final', 'simulacro', 'quiz'], {
        errorMap: () => ({ message: 'Tipo de examen inválido' }),
    } as any),
    
    fecha: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
        .refine((date) => {
            const d = new Date(date);
            return d instanceof Date && !isNaN(d.getTime());
        }, 'Fecha inválida'),
    
    hora_inicio: z
        .string()
        .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    
    duracion_minutos: z
        .number()
        .int('La duración debe ser un número entero')
        .min(1, 'La duración debe ser al menos 1 minuto')
        .max(480, 'La duración no puede exceder 8 horas (480 minutos)'),
    
    estado: z.enum(['programado', 'completado', 'cancelado'], {
        errorMap: () => ({ message: 'Estado inválido' }),
    } as any),
    
    puntaje_total: z
        .number()
        .min(1, 'El puntaje total debe ser al menos 1')
        .max(1000, 'El puntaje total no puede exceder 1000'),
});

export type ExamenFormData = z.infer<typeof examenSchema>;

