import { Router } from 'express';
import {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
} from '../controllers/cursos.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createCursoSchema, updateCursoSchema, idParamSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Cursos
 * 
 * Base: /api/cursos
 * 
 * Endpoints:
 * - GET    /              → Lista todos los cursos (requiere autenticación, con filtros opcionales)
 * - GET    /:id           → Obtiene un curso por ID (requiere autenticación)
 * - POST   /              → Crea un nuevo curso (requiere autenticación)
 * - PUT    /:id           → Actualiza un curso (requiere autenticación)
 * - DELETE /:id           → Elimina un curso (requiere rol administrador)
 * 
 * Filtros para GET /:
 * - ?nivel=basico         → Filtrar por nivel
 * - ?codigo=MAT          → Filtrar por código (búsqueda parcial)
 * - ?nombre=Matemáticas  → Filtrar por nombre (búsqueda parcial)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getCursos);
router.get('/:id', validateParams(idParamSchema), getCursoById);
router.post('/', validateBody(createCursoSchema), createCurso);
router.put('/:id', validateParams(idParamSchema), validateBody(updateCursoSchema), updateCurso);

// Solo administradores pueden eliminar cursos
router.delete('/:id', validateParams(idParamSchema), requireRole(['administrador']), deleteCurso);

export default router;

