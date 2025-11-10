import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { loginSchema } from '../validations/schemas';

const router = Router();

/**
 * Rutas de Autenticación
 * 
 * Base: /api/auth
 * 
 * Endpoints:
 * - POST   /login      → Inicia sesión y obtiene token JWT
 * - GET    /me         → Obtiene información del usuario autenticado (requiere token)
 */
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, getMe); // Protegida con JWT

export default router;

