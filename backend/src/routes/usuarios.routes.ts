import { Router } from 'express';
import {
    createUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarios,
    updateUsuario,
} from '../controllers/usuarios.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createUsuarioSchema, updateUsuarioSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Usuarios
 * 
 * Base: /api/usuarios
 * 
 * Endpoints:
 * - GET    /              → Lista todos los usuarios (requiere autenticación)
 * - GET    /:id           → Obtiene un usuario por ID (requiere autenticación)
 * - POST   /              → Crea un nuevo usuario (requiere autenticación)
 * - PUT    /:id           → Actualiza un usuario (requiere autenticación)
 * - DELETE /:id           → Elimina un usuario (requiere rol administrador)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getUsuarios);
router.get('/:id', validateParams(idParamSchema), getUsuarioById);
router.post('/', validateBody(createUsuarioSchema), createUsuario);
router.put('/:id', validateParams(idParamSchema), validateBody(updateUsuarioSchema), updateUsuario);

// Solo administradores pueden eliminar usuarios
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteUsuario);

export default router;

