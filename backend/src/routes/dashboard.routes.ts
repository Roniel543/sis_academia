import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/stats ->esto listo para ser el endpoint de stats
router.get('/stats', getStats);

export default router;

