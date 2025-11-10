import { Router } from 'express';
import {
    getProfesores,
    getProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesor,
} from '../controllers/profesores.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createProfesorSchema, updateProfesorSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Profesores
 * 
 * Base: /api/profesores
 * 
 * Endpoints:
 * - GET    /              → Lista todos los profesores (requiere autenticación, con filtros opcionales)
 * - GET    /:id           → Obtiene un profesor por ID (requiere autenticación)
 * - POST   /              → Crea un nuevo profesor (requiere autenticación)
 * - PUT    /:id           → Actualiza un profesor (requiere autenticación)
 * - DELETE /:id           → Elimina un profesor (requiere rol administrador)
 * 
 * Filtros para GET /:
 * - ?departamento=Matemáticas → Filtrar por departamento (búsqueda parcial)
 * - ?especialidad=Álgebra     → Filtrar por especialidad (búsqueda parcial)
 * - ?codigo=PROF001            → Filtrar por código (búsqueda parcial)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getProfesores);
router.get('/:id', validateParams(idParamSchema), getProfesorById);
router.post('/', validateBody(createProfesorSchema), createProfesor);
router.put('/:id', validateParams(idParamSchema), validateBody(updateProfesorSchema), updateProfesor);

// Solo administradores pueden eliminar profesores
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteProfesor);

export default router;

