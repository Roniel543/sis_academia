import { z } from 'zod';

/**
 * Schema de validación para crear/actualizar usuarios
 * Usado tanto en frontend (react-hook-form) como referencia para backend
 */
export const usuarioSchema = z.object({
    nombre_completo: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    
    email: z
        .string()
        .email('Email inválido')
        .toLowerCase()
        .max(100, 'El email no puede exceder 100 caracteres'),
    
    contrasena: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
        .optional(),
    
    rol: z.enum(['administrador', 'profesor', 'estudiante'], {
        errorMap: () => ({ message: 'Rol inválido' }),
    } as any),
    
    estado: z.enum(['activo', 'inactivo'], {
        errorMap: () => ({ message: 'Estado inválido' }),
    } as any),
});

/**
 * Schema para crear usuario (contraseña requerida)
 */
export const createUsuarioSchema = usuarioSchema.extend({
    contrasena: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
});

/**
 * Schema para actualizar usuario (contraseña opcional)
 */
export const updateUsuarioSchema = usuarioSchema.partial().extend({
    nombre_completo: usuarioSchema.shape.nombre_completo.optional(),
    email: usuarioSchema.shape.email.optional(),
    rol: usuarioSchema.shape.rol.optional(),
    estado: usuarioSchema.shape.estado.optional(),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type CreateUsuarioFormData = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;

