import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/cursos
 * Lista todos los cursos
 * 
 * Qué hace
 * - Obtiene todos los cursos de la BD
 * - Permite filtrar por nivel, código, o nombre
 * - Ordena por código de curso
 */
export const getCursos = async (req: Request, res: Response) => {
    try {
        const { nivel, codigo, nombre } = req.query;

        // Construir filtros
        const where: any = {};
        if (nivel) {
            where.nivel = nivel;
        }
        if (codigo) {
            where.codigo_curso = {
                contains: codigo as string,
                mode: 'insensitive',
            };
        }
        if (nombre) {
            where.nombre = {
                contains: nombre as string,
                mode: 'insensitive',
            };
        }

        const cursos = await prisma.curso.findMany({
            where,
            orderBy: {
                codigo_curso: 'asc',
            },
        });

        res.json({
            success: true,
            data: cursos,
            count: cursos.length,
        });
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener cursos',
        });
    }
};

/**
 * GET /api/cursos/:id
 * Obtiene un curso específico por ID
 */
export const getCursoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cursoId = parseInt(id);

        if (isNaN(cursoId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const curso = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado',
            });
        }

        res.json({
            success: true,
            data: curso,
        });
    } catch (error) {
        console.error('Error al obtener curso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener curso',
        });
    }
};

/**
 * POST /api/cursos
 * Crea un nuevo curso
 * 
 * Qué hace
 * - Valida que el código de curso sea único
 * - Crea el curso con los datos proporcionados
 */
export const createCurso = async (req: Request, res: Response) => {
    try {
        const { codigo_curso, nombre, descripcion, creditos, horas_semanales, nivel } = req.body;

        // Validar campos requeridos
        if (!codigo_curso || !nombre || !creditos || !horas_semanales || !nivel) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: codigo_curso, nombre, creditos, horas_semanales, nivel',
            });
        }

        // Verificar que el código de curso no exista
        const cursoExistente = await prisma.curso.findUnique({
            where: { codigo_curso },
        });

        if (cursoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El código de curso ya existe',
            });
        }

        // Crear curso
        const nuevoCurso = await prisma.curso.create({
            data: {
                codigo_curso,
                nombre,
                descripcion: descripcion || null,
                creditos: parseInt(creditos),
                horas_semanales: parseInt(horas_semanales),
                nivel,
            },
        });

        res.status(201).json({
            success: true,
            data: nuevoCurso,
            message: 'Curso creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear curso',
        });
    }
};

/**
 * PUT /api/cursos/:id
 * Actualiza un curso existente
 */
export const updateCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cursoId = parseInt(id);
        const { codigo_curso, nombre, descripcion, creditos, horas_semanales, nivel } = req.body;

        if (isNaN(cursoId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el curso existe
        const cursoExistente = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!cursoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado',
            });
        }

        // Si se cambia el código, verificar que no esté en uso
        if (codigo_curso && codigo_curso !== cursoExistente.codigo_curso) {
            const codigoEnUso = await prisma.curso.findUnique({
                where: { codigo_curso },
            });

            if (codigoEnUso) {
                return res.status(400).json({
                    success: false,
                    message: 'El código de curso ya está en uso',
                });
            }
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (codigo_curso) datosActualizar.codigo_curso = codigo_curso;
        if (nombre) datosActualizar.nombre = nombre;
        if (descripcion !== undefined) datosActualizar.descripcion = descripcion;
        if (creditos) datosActualizar.creditos = parseInt(creditos);
        if (horas_semanales) datosActualizar.horas_semanales = parseInt(horas_semanales);
        if (nivel) datosActualizar.nivel = nivel;

        const cursoActualizado = await prisma.curso.update({
            where: { id: cursoId },
            data: datosActualizar,
        });

        res.json({
            success: true,
            data: cursoActualizado,
            message: 'Curso actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar curso',
        });
    }
};

/**
 * DELETE /api/cursos/:id
 * Elimina un curso
 * 
 * Qué hace
 * - Elimina el curso de la BD
 * - También elimina automáticamente las matrículas relacionadas (CASCADE)
 * - También elimina los exámenes relacionados (CASCADE)
 */
export const deleteCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cursoId = parseInt(id);

        if (isNaN(cursoId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el curso existe
        const curso = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado',
            });
        }

        // Eliminar curso (las relaciones se eliminan automáticamente por CASCADE)
        await prisma.curso.delete({
            where: { id: cursoId },
        });

        res.json({
            success: true,
            message: 'Curso eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar curso',
        });
    }
};

