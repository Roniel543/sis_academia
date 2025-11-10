import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * GET /api/profesores
 * Lista todos los profesores con información del usuario
 * 
 * Qué hace
 * - Obtiene todos los profesores de la BD
 * - Incluye datos del usuario relacionado
 * - Permite filtrar por departamento, especialidad, o código
 */
export const getProfesores = async (req: Request, res: Response) => {
    try {
        const { departamento, especialidad, codigo } = req.query;

        // Construir filtros
        const where: any = {};
        if (departamento) {
            where.departamento = {
                contains: departamento as string,
                mode: 'insensitive',
            };
        }
        if (especialidad) {
            where.especialidad = {
                contains: especialidad as string,
                mode: 'insensitive',
            };
        }
        if (codigo) {
            where.codigo_profesor = {
                contains: codigo as string,
                mode: 'insensitive',
            };
        }

        const profesores = await prisma.profesor.findMany({
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
                codigo_profesor: 'asc',
            },
        });

        res.json({
            success: true,
            data: profesores,
            count: profesores.length,
        });
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesores',
        });
    }
};

/**
 * GET /api/profesores/:id
 * Obtiene un profesor específico por ID
 */
export const getProfesorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profesorId = parseInt(id);

        if (isNaN(profesorId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const profesor = await prisma.profesor.findUnique({
            where: { id: profesorId },
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

        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado',
            });
        }

        res.json({
            success: true,
            data: profesor,
        });
    } catch (error) {
        console.error('Error al obtener profesor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesor',
        });
    }
};

/**
 * POST /api/profesores
 * Crea un nuevo profesor
 * 
 * Qué hace
 * - Valida que el usuario exista y sea de rol "profesor"
 * - Valida que el código de profesor sea único
 * - Crea el registro de profesor asociado al usuario
 */
export const createProfesor = async (req: Request, res: Response) => {
    try {
        const { usuario_id, codigo_profesor, departamento, especialidad, titulo } = req.body;

        // Validar campos requeridos
        if (!usuario_id || !codigo_profesor || !departamento || !titulo) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: usuario_id, codigo_profesor, departamento, titulo',
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

        // Verificar que el usuario sea de rol profesor
        if (usuario.rol !== 'profesor') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener rol "profesor"',
            });
        }

        // Verificar que el código de profesor no exista
        const codigoExistente = await prisma.profesor.findUnique({
            where: { codigo_profesor },
        });

        if (codigoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El código de profesor ya existe',
            });
        }

        // Verificar que el usuario no tenga ya un registro de profesor
        const profesorExistente = await prisma.profesor.findUnique({
            where: { id: usuario_id },
        });

        if (profesorExistente) {
            return res.status(400).json({
                success: false,
                message: 'Este usuario ya tiene un registro de profesor',
            });
        }

        // Crear profesor
        const nuevoProfesor = await prisma.profesor.create({
            data: {
                id: usuario_id, // Mismo ID que el usuario
                codigo_profesor,
                departamento,
                especialidad: especialidad || null,
                titulo,
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
            data: nuevoProfesor,
            message: 'Profesor creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear profesor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear profesor',
        });
    }
};

/**
 * PUT /api/profesores/:id
 * Actualiza un profesor existente
 */
export const updateProfesor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profesorId = parseInt(id);
        const { codigo_profesor, departamento, especialidad, titulo } = req.body;

        if (isNaN(profesorId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el profesor existe
        const profesorExistente = await prisma.profesor.findUnique({
            where: { id: profesorId },
        });

        if (!profesorExistente) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado',
            });
        }

        // Si se cambia el código, verificar que no esté en uso
        if (codigo_profesor && codigo_profesor !== profesorExistente.codigo_profesor) {
            const codigoEnUso = await prisma.profesor.findUnique({
                where: { codigo_profesor },
            });

            if (codigoEnUso) {
                return res.status(400).json({
                    success: false,
                    message: 'El código de profesor ya está en uso',
                });
            }
        }

        // Preparar datos para actualizar
        const datosActualizar: any = {};
        if (codigo_profesor) datosActualizar.codigo_profesor = codigo_profesor;
        if (departamento) datosActualizar.departamento = departamento;
        if (especialidad !== undefined) datosActualizar.especialidad = especialidad;
        if (titulo) datosActualizar.titulo = titulo;

        const profesorActualizado = await prisma.profesor.update({
            where: { id: profesorId },
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
            data: profesorActualizado,
            message: 'Profesor actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar profesor',
        });
    }
};

/**
 * DELETE /api/profesores/:id
 * Elimina un profesor
 * 
 * Qué hace
 * - Elimina el registro de profesor
 * - NO elimina el usuario (solo la relación)
 */
export const deleteProfesor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profesorId = parseInt(id);

        if (isNaN(profesorId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        // Verificar que el profesor existe
        const profesor = await prisma.profesor.findUnique({
            where: { id: profesorId },
        });

        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado',
            });
        }

        // Eliminar profesor
        await prisma.profesor.delete({
            where: { id: profesorId },
        });

        res.json({
            success: true,
            message: 'Profesor eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar profesor',
        });
    }
};

