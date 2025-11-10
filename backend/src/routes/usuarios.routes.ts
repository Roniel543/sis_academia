import { Router } from 'express';
import {
    createUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarios,
    updateUsuario,
} from '../controllers/usuarios.controller';

const router = Router();

// GET /api/usuarios
router.get('/', getUsuarios);

// GET /api/usuarios/:id
router.get('/:id', getUsuarioById);

// POST /api/usuarios
router.post('/', createUsuario);

// PUT /api/usuarios/:id
router.put('/:id', updateUsuario);

// DELETE /api/usuarios/:id
router.delete('/:id', deleteUsuario);

export default router;

