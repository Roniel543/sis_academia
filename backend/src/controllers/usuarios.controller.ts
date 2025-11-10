import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { hashPassword } from '../utils/password';

// GET /api/usuarios - Listar todos los usuarios
export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nombre_completo: true,
                email: true,
                rol: true,
                estado: true,
                fecha_registro: true,
                ultima_conexion: true,
                // No incluir contrasena
            },
            orderBy: {
                fecha_registro: 'desc',
            },
        });

        res.json({
            success: true,
            data: usuarios,
            count: usuarios.length,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
        });
    }
};

// GET /api/usuarios/:id - Obtener un usuario por ID
export const getUsuarioById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = parseInt(id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
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

        res.json({
            success: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
        });
    }
};

// POST /api/usuarios - Crear nuevo usuario
export const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre_completo, email, contrasena, rol, estado } = req.body;

        // Validar campos requeridos
        if (!nombre_completo || !email || !contrasena || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos',
            });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email },
        });

        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado',
            });
        }

        // Hashear contraseña antes de guardar
        const contrasenaHasheada = await hashPassword(contrasena);

        // Crear usuario
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre_completo,
                email,
                contrasena: contrasenaHasheada, // Contraseña hasheada con bcrypt
                rol,
                estado: estado || 'activo',
            },
            select: {
                id: true,
                nombre_completo: true,
                email: true,
                rol: true,
                estado: true,
                fecha_registro: true,
            },
        });

        res.status(201).json({
            success: true,
            data: nuevoUsuario,
            message: 'Usuario creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
        });
    }
};

// PUT /api/usuarios/:id - Actualizar usuario
export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = parseInt(id);
        const { nombre_completo, email, contrasena, rol, estado } = req.body;

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar si el usuario existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuarioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Si se cambia el email, verificar que no esté en uso
        if (email && email !== usuarioExistente.email) {
            const emailEnUso = await prisma.usuario.findUnique({
                where: { email },
            });

            if (emailEnUso) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso',
                });
            }
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (nombre_completo) datosActualizar.nombre_completo = nombre_completo;
        if (email) datosActualizar.email = email;
        if (contrasena) {
            // Hashear contraseña si se proporciona
            datosActualizar.contrasena = await hashPassword(contrasena);
        }
        if (rol) datosActualizar.rol = rol;
        if (estado) datosActualizar.estado = estado;

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data: datosActualizar,
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

        res.json({
            success: true,
            data: usuarioActualizado,
            message: 'Usuario actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
        });
    }
};

// DELETE /api/usuarios/:id - Eliminar usuario
export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = parseInt(id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar si el usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        await prisma.usuario.delete({
            where: { id: usuarioId },
        });

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
        });
    }
};

