import { Router } from 'express';
import {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
} from '../controllers/estudiantes.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createEstudianteSchema, updateEstudianteSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Estudiantes
 * 
 * Base: /api/estudiantes
 * 
 * Endpoints:
 * - GET    /              → Lista todos los estudiantes (requiere autenticación, con filtros opcionales)
 * - GET    /:id           → Obtiene un estudiante por ID (requiere autenticación)
 * - POST   /              → Crea un nuevo estudiante (requiere autenticación)
 * - PUT    /:id           → Actualiza un estudiante (requiere autenticación)
 * - DELETE /:id           → Elimina un estudiante (requiere rol administrador)
 * 
 * Filtros para GET /:
 * - ?carrera=Ingeniería   → Filtrar por carrera (búsqueda parcial)
 * - ?semestre=5           → Filtrar por semestre
 * - ?codigo=EST001        → Filtrar por código (búsqueda parcial)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getEstudiantes);
router.get('/:id', validateParams(idParamSchema), getEstudianteById);
router.post('/', validateBody(createEstudianteSchema), createEstudiante);
router.put('/:id', validateParams(idParamSchema), validateBody(updateEstudianteSchema), updateEstudiante);

// Solo administradores pueden eliminar estudiantes
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteEstudiante);

export default router;

