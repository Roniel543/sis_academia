import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/estudiantes
 * Lista todos los estudiantes con información del usuario
 * 
 * Qué hace
 * - Obtiene todos los estudiantes de la BD
 * - Incluye datos del usuario relacionado
 * - Permite filtrar por carrera, semestre, o código
 */
export const getEstudiantes = async (req: Request, res: Response) => {
    try {
        const { carrera, semestre, codigo } = req.query;

        // Construir filtros
        const where: any = {};
        if (carrera) {
            where.carrera = {
                contains: carrera as string,
                mode: 'insensitive',
            };
        }
        if (semestre) {
            where.semestre = parseInt(semestre as string);
        }
        if (codigo) {
            where.codigo_estudiante = {
                contains: codigo as string,
                mode: 'insensitive',
            };
        }

        const estudiantes = await prisma.estudiante.findMany({
            where,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                        estado: true,
                        fecha_registro: true,
                    },
                },
            },
            orderBy: {
                codigo_estudiante: 'asc',
            },
        });

        res.json({
            success: true,
            data: estudiantes,
            count: estudiantes.length,
        });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiantes',
        });
    }
};

/**
 * GET /api/estudiantes/:id
 * Obtiene un estudiante específico por ID
 */
export const getEstudianteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const estudianteId = parseInt(id);

        if (isNaN(estudianteId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const estudiante = await prisma.estudiante.findUnique({
            where: { id: estudianteId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        email: true,
                        rol: true,
                        estado: true,
                        fecha_registro: true,
                        ultima_conexion: true,
                    },
                },
            },
        });

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado',
            });
        }

        res.json({
            success: true,
            data: estudiante,
        });
    } catch (error) {
        console.error('Error al obtener estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiante',
        });
    }
};

/**
 * POST /api/estudiantes
 * Crea un nuevo estudiante
 * 
 * Qué hace
 * - Valida que el usuario exista y sea de rol "estudiante"
 * - Valida que el código de estudiante sea único
 * - Crea el registro de estudiante asociado al usuario
 */
export const createEstudiante = async (req: Request, res: Response) => {
    try {
        const { usuario_id, codigo_estudiante, carrera, semestre, telefono, direccion } = req.body;

        // Validar campos requeridos
        if (!usuario_id || !codigo_estudiante || !carrera || !semestre) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: usuario_id, codigo_estudiante, carrera, semestre',
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

        // Verificar que el usuario sea de rol estudiante
        if (usuario.rol !== 'estudiante') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener rol "estudiante"',
            });
        }

        // Verificar que el código de estudiante no exista
        const codigoExistente = await prisma.estudiante.findUnique({
            where: { codigo_estudiante },
        });

        if (codigoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El código de estudiante ya existe',
            });
        }

        // Verificar que el usuario no tenga ya un registro de estudiante
        const estudianteExistente = await prisma.estudiante.findUnique({
            where: { id: usuario_id },
        });

        if (estudianteExistente) {
            return res.status(400).json({
                success: false,
                message: 'Este usuario ya tiene un registro de estudiante',
            });
        }

        // Crear estudiante
        const nuevoEstudiante = await prisma.estudiante.create({
            data: {
                id: usuario_id, // Mismo ID que el usuario
                codigo_estudiante,
                carrera,
                semestre: parseInt(semestre),
                telefono: telefono || null,
                direccion: direccion || null,
            },
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

        res.status(201).json({
            success: true,
            data: nuevoEstudiante,
            message: 'Estudiante creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear estudiante',
        });
    }
};

/**
 * PUT /api/estudiantes/:id
 * Actualiza un estudiante existente
 */
export const updateEstudiante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const estudianteId = parseInt(id);
        const { codigo_estudiante, carrera, semestre, telefono, direccion } = req.body;

        if (isNaN(estudianteId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el estudiante existe
        const estudianteExistente = await prisma.estudiante.findUnique({
            where: { id: estudianteId },
        });

        if (!estudianteExistente) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado',
            });
        }

        // Si se cambia el código, verificar que no esté en uso
        if (codigo_estudiante && codigo_estudiante !== estudianteExistente.codigo_estudiante) {
            const codigoEnUso = await prisma.estudiante.findUnique({
                where: { codigo_estudiante },
            });

            if (codigoEnUso) {
                return res.status(400).json({
                    success: false,
                    message: 'El código de estudiante ya está en uso',
                });
            }
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (codigo_estudiante) datosActualizar.codigo_estudiante = codigo_estudiante;
        if (carrera) datosActualizar.carrera = carrera;
        if (semestre) datosActualizar.semestre = parseInt(semestre);
        if (telefono !== undefined) datosActualizar.telefono = telefono;
        if (direccion !== undefined) datosActualizar.direccion = direccion;

        const estudianteActualizado = await prisma.estudiante.update({
            where: { id: estudianteId },
            data: datosActualizar,
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

        res.json({
            success: true,
            data: estudianteActualizado,
            message: 'Estudiante actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estudiante',
        });
    }
};

/**
 * DELETE /api/estudiantes/:id
 * Elimina un estudiante
 * 
 * Qué hace
 * - Elimina el registro de estudiante
 * - NO elimina el usuario (solo la relación)
 * - Elimina automáticamente las matrículas relacionadas (CASCADE)
 */
export const deleteEstudiante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const estudianteId = parseInt(id);

        if (isNaN(estudianteId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el estudiante existe
        const estudiante = await prisma.estudiante.findUnique({
            where: { id: estudianteId },
        });

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado',
            });
        }

        // Eliminar estudiante (las matrículas se eliminan automáticamente por CASCADE)
        await prisma.estudiante.delete({
            where: { id: estudianteId },
        });

        res.json({
            success: true,
            message: 'Estudiante eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar estudiante',
        });
    }
};

