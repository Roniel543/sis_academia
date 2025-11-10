import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login ->esto listo para ser el endpoint de login 
router.post('/login', login);

export default router;

