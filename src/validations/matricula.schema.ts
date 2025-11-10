import { z } from 'zod';

/**
 * Schema de validación para crear/actualizar matrículas
 */
export const matriculaSchema = z.object({
    estudiante_id: z
        .number()
        .int('ID de estudiante inválido')
        .positive('El ID de estudiante debe ser positivo'),
    
    curso_id: z
        .number()
        .int('ID de curso inválido')
        .positive('El ID de curso debe ser positivo'),
    
    semestre: z
        .string()
        .min(5, 'El semestre debe tener formato YYYY-P (ej: 2024-1)')
        .max(10, 'El semestre no puede exceder 10 caracteres')
        .regex(/^\d{4}-[12]$/, 'Formato inválido. Use: YYYY-P (ej: 2024-1)'),
    
    estado: z.enum(['pendiente', 'matriculado', 'cancelado', 'completado'], {
        errorMap: () => ({ message: 'Estado inválido' }),
    } as any),
    
    nota_final: z
        .number()
        .min(0, 'La nota no puede ser negativa')
        .max(20, 'La nota no puede exceder 20')
        .optional()
        .or(z.literal('')),
});

export type MatriculaFormData = z.infer<typeof matriculaSchema>;

