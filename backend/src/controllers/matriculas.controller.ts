import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/matriculas
 * Lista todas las matrículas con información relacionada
 * 
 * ¿Qué hace?
 * - Obtiene todas las matrículas de la BD
 * - Incluye datos del estudiante y curso relacionados
 * - Ordena por fecha de matrícula (más recientes primero)
 */
export const getMatriculas = async (req: Request, res: Response) => {
    try {
        const matriculas = await prisma.matricula.findMany({
            include: {
                estudiante: {
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
                },
                curso: true,
            },
            orderBy: {
                fecha_matricula: 'desc',
            },
        });

        res.json({
            success: true,
            data: matriculas,
            count: matriculas.length,
        });
    } catch (error) {
        console.error('Error al obtener matrículas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener matrículas',
        });
    }
};

/**
 * GET /api/matriculas/:id
 * Obtiene una matrícula específica por ID
 */
export const getMatriculaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const matriculaId = parseInt(id);

        if (isNaN(matriculaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const matricula = await prisma.matricula.findUnique({
            where: { id: matriculaId },
            include: {
                estudiante: {
                    include: {
                        usuario: true,
                    },
                },
                curso: true,
            },
        });

        if (!matricula) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada',
            });
        }

        res.json({
            success: true,
            data: matricula,
        });
    } catch (error) {
        console.error('Error al obtener matrícula:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener matrícula',
        });
    }
};

/**
 * POST /api/matriculas
 * Crea una nueva matrícula
 * 
 * Qué hace
 * - Valida que el estudiante y curso existan
 * - Verifica que no haya duplicados (mismo estudiante, curso y semestre)
 * - Crea la matrícula con estado "pendiente" por defecto
 */
export const createMatricula = async (req: Request, res: Response) => {
    try {
        const { estudiante_id, curso_id, semestre, estado, nota_final } = req.body;

        // Validar campos requeridos
        if (!estudiante_id || !curso_id || !semestre) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: estudiante_id, curso_id, semestre',
            });
        }

        // Verificar que el estudiante existe
        const estudiante = await prisma.estudiante.findUnique({
            where: { id: estudiante_id },
        });

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado',
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

        // Verificar que no exista una matrícula duplicada
        const matriculaExistente = await prisma.matricula.findFirst({
            where: {
                estudiante_id,
                curso_id,
                semestre,
            },
        });

        if (matriculaExistente) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante ya está matriculado en este curso para este semestre',
            });
        }

        // Crear matrícula
        const nuevaMatricula = await prisma.matricula.create({
            data: {
                estudiante_id,
                curso_id,
                semestre,
                estado: estado || 'pendiente',
                nota_final: nota_final ? parseFloat(nota_final) : null,
            },
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
        });

        res.status(201).json({
            success: true,
            data: nuevaMatricula,
            message: 'Matrícula creada exitosamente',
        });
    } catch (error) {
        console.error('Error al crear matrícula:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear matrícula',
        });
    }
};

/**
 * PUT /api/matriculas/:id
 * Actualiza una matrícula existente
 */
export const updateMatricula = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const matriculaId = parseInt(id);
        const { estudiante_id, curso_id, semestre, estado, nota_final } = req.body;

        if (isNaN(matriculaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que la matrícula existe
        const matriculaExistente = await prisma.matricula.findUnique({
            where: { id: matriculaId },
        });

        if (!matriculaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada',
            });
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (estudiante_id) datosActualizar.estudiante_id = estudiante_id;
        if (curso_id) datosActualizar.curso_id = curso_id;
        if (semestre) datosActualizar.semestre = semestre;
        if (estado) datosActualizar.estado = estado;
        if (nota_final !== undefined) {
            datosActualizar.nota_final = nota_final ? parseFloat(nota_final) : null;
        }

        const matriculaActualizada = await prisma.matricula.update({
            where: { id: matriculaId },
            data: datosActualizar,
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
        });

        res.json({
            success: true,
            data: matriculaActualizada,
            message: 'Matrícula actualizada exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar matrícula:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar matrícula',
        });
    }
};

/**
 * DELETE /api/matriculas/:id
 * Elimina una matrícula
 * 
 * Qué hace
 * - Elimina la matrícula de la BD
 * - También elimina automáticamente las asistencias relacionadas (CASCADE)
 * - También elimina los resultados de exámenes relacionados (CASCADE)
 */
export const deleteMatricula = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const matriculaId = parseInt(id);

        if (isNaN(matriculaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que la matrícula existe
        const matricula = await prisma.matricula.findUnique({
            where: { id: matriculaId },
        });

        if (!matricula) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada',
            });
        }

        // Eliminar matrícula (las relaciones se eliminan automáticamente por CASCADE)
        await prisma.matricula.delete({
            where: { id: matriculaId },
        });

        res.json({
            success: true,
            message: 'Matrícula eliminada exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar matrícula:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar matrícula',
        });
    }
};

