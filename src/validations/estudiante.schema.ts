import { z } from 'zod';

/**
 * Schema de validación para crear/actualizar estudiantes
 */
export const estudianteSchema = z.object({
    usuario_id: z
        .number()
        .int('ID de usuario inválido')
        .positive('El ID de usuario debe ser positivo'),
    
    codigo_estudiante: z
        .string()
        .min(3, 'El código debe tener al menos 3 caracteres')
        .max(20, 'El código no puede exceder 20 caracteres')
        .regex(/^[A-Za-z0-9]+$/, 'El código solo puede contener letras y números')
        .transform((val) => val.toUpperCase()),
    
    carrera: z
        .string()
        .min(3, 'La carrera debe tener al menos 3 caracteres')
        .max(100, 'La carrera no puede exceder 100 caracteres'),
    
    semestre: z
        .number()
        .int('El semestre debe ser un número entero')
        .min(1, 'El semestre debe ser al menos 1')
        .max(20, 'El semestre no puede exceder 20'),
    
    telefono: z
        .string()
        .regex(/^\+?[\d\s-()]+$/, 'Formato de teléfono inválido')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .optional()
        .or(z.literal('')),
    
    direccion: z
        .string()
        .max(200, 'La dirección no puede exceder 200 caracteres')
        .optional()
        .or(z.literal('')),
});

export type EstudianteFormData = z.infer<typeof estudianteSchema>;

