import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware de validación con Zod
 * 
 * Qué hace
 * - Valida el body, query o params de un request usando un esquema Zod
 * - Si la validación falla, retorna errores detallados
 * - Si pasa, continúa al siguiente middleware/controller
 * 
 * Uso:
 * router.post('/usuarios', validateBody(createUsuarioSchema), createUsuario);
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                });
            }
        }
    };
};

export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Error de validación en query params',
                    errors,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                });
            }
        }
    };
};

export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Error de validación en parámetros',
                    errors,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                });
            }
        }
    };
};

