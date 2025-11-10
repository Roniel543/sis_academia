import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/examenes
 * Lista todos los exámenes con información relacionada
 * 
 * Qué hace
 * - Obtiene todos los exámenes de la BD
 * - Incluye datos del curso relacionado
 * - Permite filtrar por curso_id, fecha, tipo, o estado
 */
export const getExamenes = async (req: Request, res: Response) => {
    try {
        const { curso_id, fecha, tipo, estado } = req.query;

        // Construir filtros
        const where: any = {};
        if (curso_id) {
            where.curso_id = parseInt(curso_id as string);
        }
        if (fecha) {
            where.fecha = new Date(fecha as string);
        }
        if (tipo) {
            where.tipo = tipo;
        }
        if (estado) {
            where.estado = estado;
        }

        const examenes = await prisma.examen.findMany({
            where,
            include: {
                curso: true,
                resultados: {
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
                            },
                        },
                    },
                },
            },
            orderBy: {
                fecha: 'desc',
            },
        });

        res.json({
            success: true,
            data: examenes,
            count: examenes.length,
        });
    } catch (error) {
        console.error('Error al obtener exámenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener exámenes',
        });
    }
};

/**
 * GET /api/examenes/:id
 * Obtiene un examen específico por ID
 */
export const getExamenById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examenId = parseInt(id);

        if (isNaN(examenId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const examen = await prisma.examen.findUnique({
            where: { id: examenId },
            include: {
                curso: true,
                resultados: {
                    include: {
                        matricula: {
                            include: {
                                estudiante: {
                                    include: {
                                        usuario: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!examen) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        res.json({
            success: true,
            data: examen,
        });
    } catch (error) {
        console.error('Error al obtener examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener examen',
        });
    }
};

/**
 * POST /api/examenes
 * Crea un nuevo examen
 * 
 * Qué hace
 * - Valida que el curso exista
 * - Crea el examen con estado "programado" por defecto
 */
export const createExamen = async (req: Request, res: Response) => {
    try {
        const { curso_id, nombre, tipo, fecha, hora_inicio, duracion_minutos, estado, puntaje_total } = req.body;

        // Validar campos requeridos
        if (!curso_id || !nombre || !tipo || !fecha || !hora_inicio || !duracion_minutos || !puntaje_total) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: curso_id, nombre, tipo, fecha, hora_inicio, duracion_minutos, puntaje_total',
            });
        }

        // Verificar que el curso existe
        const curso = await prisma.curso.findUnique({
            where: { id: curso_id },
        });

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado',
            });
        }

        // Crear examen
        const nuevoExamen = await prisma.examen.create({
            data: {
                curso_id,
                nombre,
                tipo,
                fecha: new Date(fecha),
                hora_inicio: new Date(hora_inicio),
                duracion_minutos: parseInt(duracion_minutos),
                estado: estado || 'programado',
                puntaje_total: parseFloat(puntaje_total),
            },
            include: {
                curso: true,
            },
        });

        res.status(201).json({
            success: true,
            data: nuevoExamen,
            message: 'Examen creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear examen',
        });
    }
};

/**
 * PUT /api/examenes/:id
 * Actualiza un examen existente
 */
export const updateExamen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examenId = parseInt(id);
        const { curso_id, nombre, tipo, fecha, hora_inicio, duracion_minutos, estado, puntaje_total } = req.body;

        if (isNaN(examenId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el examen existe
        const examenExistente = await prisma.examen.findUnique({
            where: { id: examenId },
        });

        if (!examenExistente) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (curso_id) datosActualizar.curso_id = curso_id;
        if (nombre) datosActualizar.nombre = nombre;
        if (tipo) datosActualizar.tipo = tipo;
        if (fecha) datosActualizar.fecha = new Date(fecha);
        if (hora_inicio) datosActualizar.hora_inicio = new Date(hora_inicio);
        if (duracion_minutos) datosActualizar.duracion_minutos = parseInt(duracion_minutos);
        if (estado) datosActualizar.estado = estado;
        if (puntaje_total) datosActualizar.puntaje_total = parseFloat(puntaje_total);

        const examenActualizado = await prisma.examen.update({
            where: { id: examenId },
            data: datosActualizar,
            include: {
                curso: true,
            },
        });

        res.json({
            success: true,
            data: examenActualizado,
            message: 'Examen actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar examen',
        });
    }
};

/**
 * DELETE /api/examenes/:id
 * Elimina un examen
 * 
 * Qué hace
 * - Elimina el examen de la BD
 * - También elimina automáticamente los resultados relacionados (CASCADE)
 */
export const deleteExamen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examenId = parseInt(id);

        if (isNaN(examenId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el examen existe
        const examen = await prisma.examen.findUnique({
            where: { id: examenId },
        });

        if (!examen) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        // Eliminar examen (los resultados se eliminan automáticamente por CASCADE)
        await prisma.examen.delete({
            where: { id: examenId },
        });

        res.json({
            success: true,
            message: 'Examen eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar examen',
        });
    }
};

/**
 * GET /api/examenes/:id/resultados
 * Obtiene todos los resultados de un examen específico
 */
export const getResultadosExamen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examenId = parseInt(id);

        if (isNaN(examenId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el examen existe
        const examen = await prisma.examen.findUnique({
            where: { id: examenId },
        });

        if (!examen) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        // Obtener resultados del examen
        const resultados = await prisma.resultadoExamen.findMany({
            where: { examen_id: examenId },
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
                puntaje_obtenido: 'desc',
            },
        });

        res.json({
            success: true,
            data: resultados,
            count: resultados.length,
        });
    } catch (error) {
        console.error('Error al obtener resultados del examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener resultados del examen',
        });
    }
};

/**
 * POST /api/examenes/:id/resultados
 * Crea o actualiza un resultado de examen
 */
export const createOrUpdateResultado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examenId = parseInt(id);
        const { matricula_id, puntaje_obtenido, fecha_presentacion, estado } = req.body;

        if (isNaN(examenId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de examen inválido',
            });
        }

        // Validar campos requeridos
        if (!matricula_id || puntaje_obtenido === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: matricula_id, puntaje_obtenido',
            });
        }

        // Verificar que el examen existe
        const examen = await prisma.examen.findUnique({
            where: { id: examenId },
        });

        if (!examen) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
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

        // Buscar si ya existe un resultado para esta matrícula y examen
        const resultadoExistente = await prisma.resultadoExamen.findFirst({
            where: {
                examen_id: examenId,
                matricula_id,
            },
        });

        let resultado;

        if (resultadoExistente) {
            // Actualizar resultado existente
            resultado = await prisma.resultadoExamen.update({
                where: { id: resultadoExistente.id },
                data: {
                    puntaje_obtenido: parseFloat(puntaje_obtenido),
                    fecha_presentacion: fecha_presentacion ? new Date(fecha_presentacion) : new Date(),
                    estado: estado || 'calificado',
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
        } else {
            // Crear nuevo resultado
            resultado = await prisma.resultadoExamen.create({
                data: {
                    examen_id: examenId,
                    matricula_id,
                    puntaje_obtenido: parseFloat(puntaje_obtenido),
                    fecha_presentacion: fecha_presentacion ? new Date(fecha_presentacion) : new Date(),
                    estado: estado || 'calificado',
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
        }

        res.json({
            success: true,
            data: resultado,
            message: resultadoExistente ? 'Resultado actualizado exitosamente' : 'Resultado creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear/actualizar resultado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear/actualizar resultado',
        });
    }
};

