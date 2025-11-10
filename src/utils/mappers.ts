// Funciones de mapeo para convertir datos del backend a tipos UI
import type { Usuario, UsuarioUI, MatriculaUI, AsistenciaUI, ExamenUI } from '../types';

/**
 * Convierte un Usuario del backend a UsuarioUI para la interfaz
 */
export const mapUsuarioToUI = (usuario: Usuario): UsuarioUI => {
    return {
        ...usuario,
        name: usuario.nombre_completo,
        enrollmentDate: usuario.fecha_registro || undefined,
    };
};

/**
 * Convierte un array de Usuarios a UsuarioUI
 */
export const mapUsuariosToUI = (usuarios: Usuario[]): UsuarioUI[] => {
    return usuarios.map(mapUsuarioToUI);
};

/**
 * Convierte una Matrícula del backend a MatriculaUI
 * 
 * Qué hace
 * - Extrae el nombre del estudiante desde la relación
 * - Extrae el nombre del curso desde la relación
 * - Convierte el estado del backend al formato UI
 */
export const mapMatriculaToUI = (matricula: any): MatriculaUI => {
    return {
        id: matricula.id,
        student: matricula.estudiante?.usuario?.nombre_completo || 'Estudiante desconocido',
        course: matricula.curso?.nombre || 'Curso desconocido',
        semester: matricula.semestre,
        status: matricula.estado === 'matriculado' ? 'enrolled' : 'pending',
        date: matricula.fecha_matricula 
            ? new Date(matricula.fecha_matricula).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
    };
};

/**
 * Convierte un array de Matrículas a MatriculaUI
 */
export const mapMatriculasToUI = (matriculas: any[]): MatriculaUI[] => {
    return matriculas.map(mapMatriculaToUI);
};

/**
 * Convierte una Asistencia del backend a AsistenciaUI
 * 
 * Qué hace
 * - Extrae el nombre del estudiante desde la relación matrícula->estudiante->usuario
 * - Extrae el nombre del curso desde la relación matrícula->curso
 * - Convierte el estado del backend al formato UI
 */
export const mapAsistenciaToUI = (asistencia: any): AsistenciaUI => {
    return {
        id: asistencia.id,
        student: asistencia.matricula?.estudiante?.usuario?.nombre_completo || 'Estudiante desconocido',
        course: asistencia.matricula?.curso?.nombre || 'Curso desconocido',
        date: asistencia.fecha 
            ? new Date(asistencia.fecha).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        status: asistencia.estado === 'presente' ? 'present' : 'absent',
        qrCode: asistencia.codigo_qr || '',
    };
};

/**
 * Convierte un array de Asistencias a AsistenciaUI
 */
export const mapAsistenciasToUI = (asistencias: any[]): AsistenciaUI[] => {
    return asistencias.map(mapAsistenciaToUI);
};

/**
 * Convierte un Examen del backend a ExamenUI
 * 
 * Qué hace
 * - Extrae el nombre del curso desde la relación
 * - Convierte la duración de minutos a formato legible
 * - Cuenta el número de resultados (estudiantes que presentaron)
 * - Convierte el estado del backend al formato UI
 */
export const mapExamenToUI = (examen: any): ExamenUI => {
    const duracionHoras = Math.floor(examen.duracion_minutos / 60);
    const duracionMinutos = examen.duracion_minutos % 60;
    const duracionTexto = duracionHoras > 0 
        ? `${duracionHoras} ${duracionHoras === 1 ? 'hora' : 'horas'}${duracionMinutos > 0 ? ` ${duracionMinutos} min` : ''}`
        : `${duracionMinutos} min`;

    return {
        id: examen.id,
        name: examen.nombre,
        course: examen.curso?.nombre || 'Curso desconocido',
        date: examen.fecha 
            ? new Date(examen.fecha).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        duration: duracionTexto,
        students: examen.resultados?.length || 0,
        status: examen.estado === 'programado' ? 'scheduled' : 'completed',
    };
};

/**
 * Convierte un array de Exámenes a ExamenUI
 */
export const mapExamenesToUI = (examenes: any[]): ExamenUI[] => {
    return examenes.map(mapExamenToUI);
};

