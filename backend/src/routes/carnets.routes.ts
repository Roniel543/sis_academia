import { Router } from 'express';
import {
    getCarnets,
    getCarnetById,
    createCarnet,
    updateCarnet,
    deleteCarnet,
} from '../controllers/carnets.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createCarnetSchema, updateCarnetSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Carnets
 * 
 * Base: /api/carnets
 * 
 * Endpoints:
 * - GET    /              → Lista todos los carnets (requiere autenticación, con filtros opcionales)
 * - GET    /:id           → Obtiene un carnet por ID (requiere autenticación)
 * - POST   /              → Crea un nuevo carnet (requiere autenticación)
 * - PUT    /:id           → Actualiza un carnet (requiere autenticación)
 * - DELETE /:id           → Elimina un carnet (requiere rol administrador)
 * 
 * Filtros para GET /:
 * - ?estado=activo        → Filtrar por estado
 * - ?usuario_id=1         → Filtrar por usuario
 * - ?codigo=CAR001        → Filtrar por código (búsqueda parcial)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getCarnets);
router.get('/:id', validateParams(idParamSchema), getCarnetById);
router.post('/', validateBody(createCarnetSchema), createCarnet);
router.put('/:id', validateParams(idParamSchema), validateBody(updateCarnetSchema), updateCarnet);

// Solo administradores pueden eliminar carnets
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteCarnet);

export default router;

