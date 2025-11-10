import { Router } from 'express';
import {
    getAsistencias,
    getAsistenciaById,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia,
} from '../controllers/asistencia.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createAsistenciaSchema, updateAsistenciaSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Asistencia
 * 
 * Base: /api/asistencia
 * 
 * Endpoints:
 * - GET    /              → Lista todas las asistencias (con filtros opcionales)
 * - GET    /:id           → Obtiene una asistencia por ID
 * - POST   /              → Crea un nuevo registro de asistencia
 * - PUT    /:id           → Actualiza una asistencia
 * - DELETE /:id           → Elimina una asistencia
 * 
 * Filtros para GET /:
 * - ?matricula_id=1      → Filtrar por matrícula
 * - ?fecha=2025-01-20    → Filtrar por fecha
 * - ?estado=presente     → Filtrar por estado
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getAsistencias);
router.get('/:id', validateParams(idParamSchema), getAsistenciaById);
router.post('/', validateBody(createAsistenciaSchema), createAsistencia);
router.put('/:id', validateParams(idParamSchema), validateBody(updateAsistenciaSchema), updateAsistencia);

// Solo administradores pueden eliminar asistencias
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteAsistencia);

export default router;

