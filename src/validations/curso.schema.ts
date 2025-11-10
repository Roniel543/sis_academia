import { z } from 'zod';

/**
 * Schema de validación para crear/actualizar cursos
 */
export const cursoSchema = z.object({
    codigo_curso: z
        .string()
        .min(3, 'El código debe tener al menos 3 caracteres')
        .max(20, 'El código no puede exceder 20 caracteres')
        .regex(/^[A-Z0-9-]+$/, 'El código solo puede contener letras mayúsculas, números y guiones')
        .transform((val) => val.toUpperCase()),
    
    nombre: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    
    descripcion: z
        .string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional()
        .or(z.literal('')),
    
    creditos: z
        .number()
        .int('Los créditos deben ser un número entero')
        .min(1, 'Los créditos deben ser al menos 1')
        .max(10, 'Los créditos no pueden exceder 10'),
    
    horas_semanales: z
        .number()
        .int('Las horas semanales deben ser un número entero')
        .min(1, 'Las horas semanales deben ser al menos 1')
        .max(20, 'Las horas semanales no pueden exceder 20'),
    
    nivel: z
        .string()
        .min(2, 'El nivel debe tener al menos 2 caracteres')
        .max(50, 'El nivel no puede exceder 50 caracteres'),
});

export type CursoFormData = z.infer<typeof cursoSchema>;

