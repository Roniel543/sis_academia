import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos',
            });
        }

        // Buscar usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
            });
        }

        // Verificar contraseña usando bcrypt
        // Si la contraseña está hasheada, usa comparePassword
        // Si no está hasheada (usuarios antiguos), compara en texto plano (migración gradual)
        const isHashed = usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$');
        let passwordMatch = false;

        if (isHashed) {
            passwordMatch = await comparePassword(password, usuario.contrasena);
        } else {
            // Compatibilidad con usuarios antiguos (sin hash)
            passwordMatch = usuario.contrasena === password;
        }

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
            });
        }

        // Retornar usuario sin contraseña
        const { contrasena, ...usuarioSinPassword } = usuario;

        // Generar token JWT
        const token = generateToken({
            userId: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        });

        res.json({
            success: true,
            data: {
                user: usuarioSinPassword,
                token, // Token JWT para autenticación
            },
            message: 'Login exitoso',
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado desde el token
 * 
 * ¿Qué hace?
 * - Lee el token del header Authorization
 * - Verifica que sea válido
 * - Obtiene los datos actualizados del usuario desde la BD
 * - Retorna el usuario sin contraseña
 */
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
            });
        }

        // Obtener usuario actualizado desde la BD
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                nombre_completo: true,
                email: true,
                rol: true,
                estado: true,
                fecha_registro: true,
                ultima_conexion: true,
            },
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Actualizar última conexión
        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultima_conexion: new Date() },
        });

        res.json({
            success: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error en getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
