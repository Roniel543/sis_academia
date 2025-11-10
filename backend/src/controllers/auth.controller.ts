import { Request, Response } from 'express';
import prisma from '../utils/prisma';

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

        // Verificar contraseña
        const passwordMatch = usuario.contrasena === password;

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
            });
        }

        // Retornar usuario sin contraseña
        const { contrasena, ...usuarioSinPassword } = usuario;

        res.json({
            success: true,
            data: usuarioSinPassword,
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

