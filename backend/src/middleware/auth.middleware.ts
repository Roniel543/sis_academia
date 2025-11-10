import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '../utils/jwt';

/**
 * Extiende el tipo Request de Express para incluir el usuario autenticado
 */
export interface AuthRequest extends Request {
    user?: TokenPayload;
}

/**
 * Middleware de autenticación JWT
 * 
 * Qué hace
 * - Verifica que el request tenga un token JWT válido
 * - Extrae el token del header Authorization
 * - Verifica que el token sea válido y no haya expirado
 * - Agrega los datos del usuario al request (req.user)
 * - Si no hay token o es inválido, retorna 401
 * 
 * Uso:
 * router.get('/ruta-protegida', authenticate, controller);
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extraer token del header
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token de autenticación requerido',
            });
            return;
        }

        // Verificar token
        const payload = verifyToken(token);

        if (!payload) {
            res.status(401).json({
                success: false,
                message: 'Token inválido o expirado',
            });
            return;
        }

        // Agregar datos del usuario al request
        req.user = payload;

        // Continuar al siguiente middleware/controller
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación',
        });
    }
};

/**
 * Middleware opcional: verifica si hay un usuario autenticado
 * pero no bloquea si no hay token (útil para rutas públicas que pueden ser privadas)
 * 
 *¿Qué hace
 * - Si hay token válido, agrega req.user
 * - Si no hay token, continúa sin req.user
 * - No retorna error, solo agrega el usuario si existe
 */
export const optionalAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (token) {
            const payload = verifyToken(token);
            if (payload) {
                req.user = payload;
            }
        }

        // Siempre continúa, con o sin usuario
        next();
    } catch (error) {
        // En caso de error, continuar sin usuario
        next();
    }
};

/**
 * Middleware para verificar roles específicos
 * 
 * @param allowedRoles - Array de roles permitidos
 * @returns Middleware que verifica el rol del usuario
 * 
 * Uso:
 * router.delete('/usuarios/:id', authenticate, requireRole(['administrador']), controller);
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        // Primero debe estar autenticado
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Autenticación requerida',
            });
            return;
        }

        // Verificar rol
        if (!allowedRoles.includes(req.user.rol)) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción',
            });
            return;
        }

        next();
    };
};

