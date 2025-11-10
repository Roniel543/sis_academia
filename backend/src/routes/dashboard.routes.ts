import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rutas de Dashboard
 * 
 * Base: /api/dashboard
 * 
 * Endpoints:
 * - GET    /stats        → Obtiene estadísticas del dashboard (requiere autenticación)
 */

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/stats', getStats);

export default router;

