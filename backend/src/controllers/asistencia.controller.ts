import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/asistencia
 * Lista todas las asistencias con información relacionada
 * 
 * Qué hace
 * - Obtiene todas las asistencias de la BD
 * - Incluye datos de la matrícula, estudiante y curso
 * - Permite filtrar por matrícula_id, fecha, o estado
 */
export const getAsistencias = async (req: Request, res: Response) => {
    try {
        const { matricula_id, fecha, estado } = req.query;

        // Construir filtros
        const where: any = {};
        if (matricula_id) {
            where.matricula_id = parseInt(matricula_id as string);
        }
        if (fecha) {
            where.fecha = new Date(fecha as string);
        }
        if (estado) {
            where.estado = estado;
        }

        const asistencias = await prisma.asistencia.findMany({
            where,
            include: {
                matricula: {
                    include: {
                        estudiante: {
                            include: {
                                usuario: {
                                    select: {
                                        id: true,
                                        nombre_completo: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        curso: true,
                    },
                },
            },
            orderBy: {
                fecha: 'desc',
            },
        });

        res.json({
            success: true,
            data: asistencias,
            count: asistencias.length,
        });
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener asistencias',
        });
    }
};

/**
 * GET /api/asistencia/:id
 * Obtiene una asistencia específica por ID
 */
export const getAsistenciaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asistenciaId = parseInt(id);

        if (isNaN(asistenciaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const asistencia = await prisma.asistencia.findUnique({
            where: { id: asistenciaId },
            include: {
                matricula: {
                    include: {
                        estudiante: {
                            include: {
                                usuario: true,
                            },
                        },
                        curso: true,
                    },
                },
            },
        });

        if (!asistencia) {
            return res.status(404).json({
                success: false,
                message: 'Asistencia no encontrada',
            });
        }

        res.json({
            success: true,
            data: asistencia,
        });
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener asistencia',
        });
    }
};

/**
 * POST /api/asistencia
 * Crea una nueva asistencia
 * 
 * Qué hace
 * - Valida que la matrícula exista
 * - Verifica que no haya duplicados (misma matrícula y fecha)
 * - Crea el registro de asistencia
 */
export const createAsistencia = async (req: Request, res: Response) => {
    try {
        const { matricula_id, codigo_qr, fecha, hora_entrada, estado, observaciones } = req.body;

        // Validar campos requeridos
        if (!matricula_id || !codigo_qr || !fecha || !hora_entrada || !estado) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: matricula_id, codigo_qr, fecha, hora_entrada, estado',
            });
        }

        // Verificar que la matrícula existe
        const matricula = await prisma.matricula.findUnique({
            where: { id: matricula_id },
        });

        if (!matricula) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada',
            });
        }

        // Verificar que no exista una asistencia duplicada
        const fechaAsistencia = new Date(fecha);
        const asistenciaExistente = await prisma.asistencia.findFirst({
            where: {
                matricula_id,
                fecha: fechaAsistencia,
            },
        });

        if (asistenciaExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un registro de asistencia para esta matrícula en esta fecha',
            });
        }

        // Crear asistencia
        const nuevaAsistencia = await prisma.asistencia.create({
            data: {
                matricula_id,
                codigo_qr,
                fecha: fechaAsistencia,
                hora_entrada: new Date(hora_entrada),
                estado,
                observaciones: observaciones || null,
            },
            include: {
                matricula: {
                    include: {
                        estudiante: {
                            include: {
                                usuario: {
                                    select: {
                                        id: true,
                                        nombre_completo: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        curso: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: nuevaAsistencia,
            message: 'Asistencia registrada exitosamente',
        });
    } catch (error) {
        console.error('Error al crear asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear asistencia',
        });
    }
};

/**
 * PUT /api/asistencia/:id
 * Actualiza una asistencia existente
 */
export const updateAsistencia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asistenciaId = parseInt(id);
        const { matricula_id, codigo_qr, fecha, hora_entrada, estado, observaciones } = req.body;

        if (isNaN(asistenciaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que la asistencia existe
        const asistenciaExistente = await prisma.asistencia.findUnique({
            where: { id: asistenciaId },
        });

        if (!asistenciaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Asistencia no encontrada',
            });
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (matricula_id) datosActualizar.matricula_id = matricula_id;
        if (codigo_qr) datosActualizar.codigo_qr = codigo_qr;
        if (fecha) datosActualizar.fecha = new Date(fecha);
        if (hora_entrada) datosActualizar.hora_entrada = new Date(hora_entrada);
        if (estado) datosActualizar.estado = estado;
        if (observaciones !== undefined) datosActualizar.observaciones = observaciones;

        const asistenciaActualizada = await prisma.asistencia.update({
            where: { id: asistenciaId },
            data: datosActualizar,
            include: {
                matricula: {
                    include: {
                        estudiante: {
                            include: {
                                usuario: {
                                    select: {
                                        id: true,
                                        nombre_completo: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        curso: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: asistenciaActualizada,
            message: 'Asistencia actualizada exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar asistencia',
        });
    }
};

/**
 * DELETE /api/asistencia/:id
 * Elimina una asistencia
 */
export const deleteAsistencia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asistenciaId = parseInt(id);

        if (isNaN(asistenciaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que la asistencia existe
        const asistencia = await prisma.asistencia.findUnique({
            where: { id: asistenciaId },
        });

        if (!asistencia) {
            return res.status(404).json({
                success: false,
                message: 'Asistencia no encontrada',
            });
        }

        // Eliminar asistencia
        await prisma.asistencia.delete({
            where: { id: asistenciaId },
        });

        res.json({
            success: true,
            message: 'Asistencia eliminada exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar asistencia',
        });
    }
};

