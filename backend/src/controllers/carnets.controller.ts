import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/carnets
 * Lista todos los carnets con información del usuario
 * 
 * Qué hace
 * - Obtiene todos los carnets de la BD
 * - Incluye datos del usuario relacionado
 * - Permite filtrar por estado, usuario_id, o código
 */
export const getCarnets = async (req: Request, res: Response) => {
    try {
        const { estado, usuario_id, codigo, codigo_qr } = req.query;

        // Construir filtros
        const where: any = {};
        if (estado) {
            where.estado = estado;
        }
        if (usuario_id) {
            where.usuario_id = parseInt(usuario_id as string);
        }
        if (codigo) {
            where.codigo_carnet = {
                contains: codigo as string,
                mode: 'insensitive',
            };
        }
        if (codigo_qr) {
            where.codigo_qr = codigo_qr as string;
        }

        const carnets = await prisma.carnet.findMany({
            where,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                        estado: true,
                    },
                },
            },
            orderBy: {
                fecha_expedicion: 'desc',
            },
        });

        res.json({
            success: true,
            data: carnets,
            count: carnets.length,
        });
    } catch (error) {
        console.error('Error al obtener carnets:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener carnets',
        });
    }
};

/**
 * GET /api/carnets/:id
 * Obtiene un carnet específico por ID
 */
export const getCarnetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const carnetId = parseInt(id);

        if (isNaN(carnetId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const carnet = await prisma.carnet.findUnique({
            where: { id: carnetId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                        estado: true,
                    },
                },
            },
        });

        if (!carnet) {
            return res.status(404).json({
                success: false,
                message: 'Carnet no encontrado',
            });
        }

        res.json({
            success: true,
            data: carnet,
        });
    } catch (error) {
        console.error('Error al obtener carnet:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener carnet',
        });
    }
};

/**
 * POST /api/carnets
 * Crea un nuevo carnet
 * 
 * Qué hace
 * - Valida que el usuario exista
 * - Valida que el código de carnet sea único
 * - Genera un código QR único si no se proporciona
 * - Crea el carnet con estado "activo" por defecto
 */
export const createCarnet = async (req: Request, res: Response) => {
    try {
        const { usuario_id, codigo_carnet, codigo_qr, fecha_expedicion, fecha_vencimiento, estado } = req.body;

        // Validar campos requeridos
        if (!usuario_id || !codigo_carnet || !fecha_expedicion || !fecha_vencimiento) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: usuario_id, codigo_carnet, fecha_expedicion, fecha_vencimiento',
            });
        }

        // Verificar que el usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuario_id },
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Verificar que el código de carnet no exista
        const codigoExistente = await prisma.carnet.findUnique({
            where: { codigo_carnet },
        });

        if (codigoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El código de carnet ya existe',
            });
        }

        // Generar código QR si no se proporciona
        const qrCode = codigo_qr || `QR-${codigo_carnet}-${Date.now()}`;

        // Crear carnet
        const nuevoCarnet = await prisma.carnet.create({
            data: {
                usuario_id,
                codigo_carnet,
                codigo_qr: qrCode,
                fecha_expedicion: new Date(fecha_expedicion),
                fecha_vencimiento: new Date(fecha_vencimiento),
                estado: estado || 'activo',
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: nuevoCarnet,
            message: 'Carnet creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear carnet:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear carnet',
        });
    }
};

/**
 * PUT /api/carnets/:id
 * Actualiza un carnet existente
 */
export const updateCarnet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const carnetId = parseInt(id);
        const { usuario_id, codigo_carnet, codigo_qr, fecha_expedicion, fecha_vencimiento, estado } = req.body;

        if (isNaN(carnetId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el carnet existe
        const carnetExistente = await prisma.carnet.findUnique({
            where: { id: carnetId },
        });

        if (!carnetExistente) {
            return res.status(404).json({
                success: false,
                message: 'Carnet no encontrado',
            });
        }

        // Si se cambia el código, verificar que no esté en uso
        if (codigo_carnet && codigo_carnet !== carnetExistente.codigo_carnet) {
            const codigoEnUso = await prisma.carnet.findUnique({
                where: { codigo_carnet },
            });

            if (codigoEnUso) {
                return res.status(400).json({
                    success: false,
                    message: 'El código de carnet ya está en uso',
                });
            }
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (usuario_id) datosActualizar.usuario_id = usuario_id;
        if (codigo_carnet) datosActualizar.codigo_carnet = codigo_carnet;
        if (codigo_qr) datosActualizar.codigo_qr = codigo_qr;
        if (fecha_expedicion) datosActualizar.fecha_expedicion = new Date(fecha_expedicion);
        if (fecha_vencimiento) datosActualizar.fecha_vencimiento = new Date(fecha_vencimiento);
        if (estado) datosActualizar.estado = estado;

        const carnetActualizado = await prisma.carnet.update({
            where: { id: carnetId },
            data: datosActualizar,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: carnetActualizado,
            message: 'Carnet actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar carnet:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar carnet',
        });
    }
};

/**
 * DELETE /api/carnets/:id
 * Elimina un carnet
 */
export const deleteCarnet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const carnetId = parseInt(id);

        if (isNaN(carnetId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el carnet existe
        const carnet = await prisma.carnet.findUnique({
            where: { id: carnetId },
        });

        if (!carnet) {
            return res.status(404).json({
                success: false,
                message: 'Carnet no encontrado',
            });
        }

        // Eliminar carnet
        await prisma.carnet.delete({
            where: { id: carnetId },
        });

        res.json({
            success: true,
            message: 'Carnet eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar carnet:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar carnet',
        });
    }
};

