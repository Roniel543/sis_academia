import { Router } from 'express';
import {
    getExamenes,
    getExamenById,
    createExamen,
    updateExamen,
    deleteExamen,
    getResultadosExamen,
    createOrUpdateResultado,
} from '../controllers/examenes.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createExamenSchema, updateExamenSchema, createResultadoExamenSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Exámenes
 * 
 * Base: /api/examenes
 * 
 * Endpoints:
 * - GET    /                    → Lista todos los exámenes (con filtros opcionales)
 * - GET    /:id                 → Obtiene un examen por ID
 * - POST   /                    → Crea un nuevo examen
 * - PUT    /:id                 → Actualiza un examen
 * - DELETE /:id                 → Elimina un examen
 * - GET    /:id/resultados      → Obtiene todos los resultados de un examen
 * - POST   /:id/resultados      → Crea o actualiza un resultado de examen
 * 
 * Filtros para GET /:
 * - ?curso_id=1      → Filtrar por curso
 * - ?fecha=2025-01-20 → Filtrar por fecha
 * - ?tipo=parcial     → Filtrar por tipo
 * - ?estado=programado → Filtrar por estado
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getExamenes);
router.get('/:id', validateParams(idParamSchema), getExamenById);
router.post('/', validateBody(createExamenSchema), createExamen);
router.put('/:id', validateParams(idParamSchema), validateBody(updateExamenSchema), updateExamen);

// Solo administradores pueden eliminar exámenes
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteExamen);

router.get('/:id/resultados', validateParams(idParamSchema), getResultadosExamen);
router.post('/:id/resultados', validateParams(idParamSchema), validateBody(createResultadoExamenSchema), createOrUpdateResultado);

export default router;

