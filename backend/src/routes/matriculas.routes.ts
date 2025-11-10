import { Router } from 'express';
import {
    getMatriculas,
    getMatriculaById,
    createMatricula,
    updateMatricula,
    deleteMatricula,
} from '../controllers/matriculas.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createMatriculaSchema, updateMatriculaSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Matrículas
 * 
 * Base: /api/matriculas
 * 
 * Endpoints:
 * - GET    /              → Lista todas las matrículas (requiere autenticación)
 * - GET    /:id           → Obtiene una matrícula por ID (requiere autenticación)
 * - POST   /              → Crea una nueva matrícula (requiere autenticación)
 * - PUT    /:id           → Actualiza una matrícula (requiere autenticación)
 * - DELETE /:id           → Elimina una matrícula (requiere rol administrador)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getMatriculas);
router.get('/:id', validateParams(idParamSchema), getMatriculaById);
router.post('/', validateBody(createMatriculaSchema), createMatricula);
router.put('/:id', validateParams(idParamSchema), validateBody(updateMatriculaSchema), updateMatricula);

// Solo administradores pueden eliminar matrículas
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteMatricula);

export default router;

