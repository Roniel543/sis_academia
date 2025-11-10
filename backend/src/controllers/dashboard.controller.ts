import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET /api/dashboard/stats - Obtener estadísticas del dashboard
export const getStats = async (req: Request, res: Response) => {
    try {
        // Contar estudiantes
        const totalStudents = await prisma.usuario.count({
            where: { rol: 'estudiante' },
        });

        // Contar profesores
        const totalTeachers = await prisma.usuario.count({
            where: { rol: 'profesor' },
        });

        // Contar matrículas activas
        const activeEnrollments = await prisma.matricula.count({
            where: { estado: 'matriculado' },
        });

        // Calcular tasa de asistencia (porcentaje de asistencias presentes)
        const totalAsistencias = await prisma.asistencia.count();
        const asistenciasPresentes = await prisma.asistencia.count({
            where: { estado: 'presente' },
        });
        const attendanceRate =
            totalAsistencias > 0
                ? (asistenciasPresentes / totalAsistencias) * 100
                : 0;

        // Contar exámenes programados
        const examsScheduled = await prisma.examen.count({
            where: { estado: 'programado' },
        });

        // Contar exámenes completados
        const examsCompleted = await prisma.examen.count({
            where: { estado: 'completado' },
        });

        res.json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                activeEnrollments,
                attendanceRate: Math.round(attendanceRate * 10) / 10, // Redondear a 1 decimal
                examsScheduled,
                examsCompleted,
            },
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
        });
    }
};

