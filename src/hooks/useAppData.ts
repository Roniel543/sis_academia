import { useState, useEffect } from 'react';
import type {
  UsuarioUI,
  MatriculaUI,
  AsistenciaUI,
  ExamenUI,
  EstadisticasDashboard,
} from '../types';
import { useUsuarios } from './useUsuarios';
import { useDashboard } from './useDashboard';
import { useMatriculas } from './useMatriculas';
import { useAsistencia } from './useAsistencia';
import { useExamenes } from './useExamenes';
import { mapUsuariosToUI, mapMatriculasToUI, mapAsistenciasToUI, mapExamenesToUI } from '../utils/mappers';

// Datos iniciales para stats (hasta que el backend proporcione todos los campos)
const initialStats: EstadisticasDashboard = {
  totalStudents: 1250,
  totalTeachers: 85,
  activeEnrollments: 980,
  attendanceRate: 92.5,
  examsScheduled: 12,
  examsCompleted: 8,
};

export const useAppData = () => {
  // Hooks conectados con el backend
  const {
    usuarios: usuariosBackend,
    loading: usuariosLoading,
    error: usuariosError,
    createUsuario: createUsuarioBackend,
    updateUsuario: updateUsuarioBackend,
    deleteUsuario: deleteUsuarioBackend,
  } = useUsuarios();

  const {
    stats: statsBackend,
    loading: statsLoading,
    error: statsError,
  } = useDashboard();

  // Hooks para matrículas, asistencia y exámenes (conectados con backend)
  const {
    matriculas: matriculasBackend,
    loading: matriculasLoading,
    error: matriculasError,
    createMatricula: createMatriculaBackend,
    updateMatricula: updateMatriculaBackend,
    deleteMatricula: deleteMatriculaBackend,
  } = useMatriculas();

  const {
    asistencias: asistenciasBackend,
    loading: asistenciasLoading,
    error: asistenciasError,
    createAsistencia: createAsistenciaBackend,
  } = useAsistencia();

  const {
    examenes: examenesBackend,
    loading: examenesLoading,
    error: examenesError,
    createExamen: createExamenBackend,
    updateExamen: updateExamenBackend,
    deleteExamen: deleteExamenBackend,
  } = useExamenes();

  // Mapear datos del backend a formato UI
  const [users, setUsers] = useState<UsuarioUI[]>([]);
  const [enrollments, setEnrollments] = useState<MatriculaUI[]>([]);
  const [attendance, setAttendance] = useState<AsistenciaUI[]>([]);
  const [exams, setExams] = useState<ExamenUI[]>([]);

  useEffect(() => {
    if (usuariosBackend.length > 0) {
      setUsers(mapUsuariosToUI(usuariosBackend));
    }
  }, [usuariosBackend]);

  useEffect(() => {
    if (matriculasBackend.length > 0) {
      setEnrollments(mapMatriculasToUI(matriculasBackend));
    }
  }, [matriculasBackend]);

  useEffect(() => {
    if (asistenciasBackend.length > 0) {
      setAttendance(mapAsistenciasToUI(asistenciasBackend));
    }
  }, [asistenciasBackend]);

  useEffect(() => {
    if (examenesBackend.length > 0) {
      setExams(mapExamenesToUI(examenesBackend));
    }
  }, [examenesBackend]);

  // Combinar stats del backend con datos locales
  const [stats, setStats] = useState<EstadisticasDashboard>(initialStats);

  useEffect(() => {
    if (statsBackend) {
      setStats({
        ...statsBackend,
        // Mantener datos locales para campos que aún no están en el backend
        activeEnrollments: enrollments.filter((e) => e.status === 'enrolled').length,
        examsScheduled: exams.filter((e) => e.status === 'scheduled').length,
        examsCompleted: exams.filter((e) => e.status === 'completed').length,
      });
    }
  }, [statsBackend, enrollments, exams]);

  // Usuarios - Conectados con backend
  // Nota: Estas funciones son async pero se llaman sin await para no bloquear la UI
  const addUser = (user: Omit<UsuarioUI, 'id'>) => {
    const { nombre_completo, email, contrasena, rol, estado } = user;
    createUsuarioBackend({
      nombre_completo,
      email,
      contrasena: contrasena || '',
      rol,
      estado,
    }).catch((err) => {
      console.error('Error al crear usuario:', err);
    });
  };

  const updateUser = (id: number, userData: Partial<UsuarioUI>) => {
    const updateData: any = {};
    if (userData.nombre_completo) updateData.nombre_completo = userData.nombre_completo;
    if (userData.email) updateData.email = userData.email;
    if (userData.rol) updateData.rol = userData.rol;
    if (userData.estado) updateData.estado = userData.estado;
    if (userData.contrasena) updateData.contrasena = userData.contrasena;

    updateUsuarioBackend(id, updateData).catch((err) => {
      console.error('Error al actualizar usuario:', err);
    });
  };

  const deleteUser = (id: number) => {
    deleteUsuarioBackend(id).catch((err) => {
      console.error('Error al eliminar usuario:', err);
    });
  };

  // Matrículas - Conectadas con backend
  const addEnrollment = (enrollment: Omit<MatriculaUI, 'id'>) => {
    // El formulario ahora envía estudiante_id y curso_id directamente
    const matriculaData: any = {
      estudiante_id: (enrollment as any).estudiante_id,
      curso_id: (enrollment as any).curso_id,
      semestre: enrollment.semester,
      estado: enrollment.status === 'enrolled' ? 'matriculado' : enrollment.status === 'pending' ? 'pendiente' : enrollment.status,
    };

    // Agregar nota_final si existe
    if (enrollment.grade !== undefined) {
      matriculaData.nota_final = enrollment.grade;
    }

    if (!matriculaData.estudiante_id || !matriculaData.curso_id) {
      console.error('Error: estudiante_id y curso_id son requeridos');
      return;
    }

    createMatriculaBackend(matriculaData).catch((err) => {
      console.error('Error al crear matrícula:', err);
    });
  };

  const updateEnrollment = (id: number, enrollmentData: Partial<MatriculaUI>) => {
    const updateData: any = {};
    if (enrollmentData.semester) updateData.semestre = enrollmentData.semester;
    if (enrollmentData.status) {
      updateData.estado = 
        enrollmentData.status === 'enrolled' ? 'matriculado' :
        enrollmentData.status === 'pending' ? 'pendiente' :
        enrollmentData.status === 'cancelled' ? 'cancelado' :
        enrollmentData.status === 'completed' ? 'completado' :
        'pendiente';
    }
    if ((enrollmentData as any).estudiante_id) updateData.estudiante_id = (enrollmentData as any).estudiante_id;
    if ((enrollmentData as any).curso_id) updateData.curso_id = (enrollmentData as any).curso_id;
    if (enrollmentData.grade !== undefined) updateData.nota_final = enrollmentData.grade;

    updateMatriculaBackend(id, updateData).catch((err) => {
      console.error('Error al actualizar matrícula:', err);
    });
  };

  const deleteEnrollment = (id: number) => {
    deleteMatriculaBackend(id).catch((err) => {
      console.error('Error al eliminar matrícula:', err);
    });
  };

  // Asistencia - Conectada con backend
  const addAttendance = (attendanceData: Omit<AsistenciaUI, 'id'>) => {
    // Convertir formato UI a formato backend
    const asistenciaData = {
      matricula_id: (attendanceData as any).matricula_id || 1, // TODO: obtener del contexto
      codigo_qr: attendanceData.qrCode,
      fecha: attendanceData.date,
      hora_entrada: new Date().toISOString(), // TODO: usar hora real
      estado: attendanceData.status === 'present' ? 'presente' : 'ausente',
      observaciones: null,
    };

    createAsistenciaBackend(asistenciaData).catch((err) => {
      console.error('Error al crear asistencia:', err);
    });
  };

  // Exámenes - Conectados con backend
  const addExam = (exam: Omit<ExamenUI, 'id'>) => {
    // El formulario ahora envía todos los datos necesarios
    // Combinar fecha y hora para crear un Date completo
    const timeStr = (exam as any).time || '08:00:00';
    const fechaHora = `${exam.date}T${timeStr}`;
    
    const examenData: any = {
      curso_id: (exam as any).curso_id,
      nombre: exam.name,
      tipo: (exam as any).type || 'parcial',
      fecha: exam.date,
      hora_inicio: fechaHora, // Formato ISO: YYYY-MM-DDTHH:MM:SS
      duracion_minutos: parseInt((exam.duration || '').replace(/\D/g, '')) || 120,
      estado: exam.status === 'scheduled' ? 'programado' : exam.status === 'completed' ? 'completado' : 'programado',
      puntaje_total: (exam as any).totalScore || 20,
    };

    createExamenBackend(examenData).catch((err) => {
      console.error('Error al crear examen:', err);
    });
  };

  const updateExam = (id: number, examData: Partial<ExamenUI>) => {
    const updateData: any = {};
    if (examData.name) updateData.nombre = examData.name;
    if ((examData as any).curso_id) updateData.curso_id = (examData as any).curso_id;
    if ((examData as any).type) updateData.tipo = (examData as any).type;
    if (examData.date) updateData.fecha = examData.date;
    if ((examData as any).time) updateData.hora_inicio = (examData as any).time;
    if (examData.duration) {
      updateData.duracion_minutos = parseInt(examData.duration.replace(/\D/g, ''));
    }
    if (examData.status) {
      updateData.estado = 
        examData.status === 'scheduled' ? 'programado' :
        examData.status === 'completed' ? 'completado' :
        examData.status === 'cancelled' ? 'cancelado' :
        'programado';
    }
    if ((examData as any).totalScore) updateData.puntaje_total = (examData as any).totalScore;

    updateExamenBackend(id, updateData).catch((err) => {
      console.error('Error al actualizar examen:', err);
    });
  };

  const deleteExam = (id: number) => {
    deleteExamenBackend(id).catch((err) => {
      console.error('Error al eliminar examen:', err);
    });
  };

  return {
    users,
    enrollments,
    attendance,
    exams,
    stats,
    // Estados de loading y error
    loading: {
      usuarios: usuariosLoading,
      stats: statsLoading,
      matriculas: matriculasLoading,
      asistencias: asistenciasLoading,
      examenes: examenesLoading,
    },
    errors: {
      usuarios: usuariosError,
      stats: statsError,
      matriculas: matriculasError,
      asistencias: asistenciasError,
      examenes: examenesError,
    },
    // Funciones CRUD
    addUser,
    updateUser,
    deleteUser,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    addAttendance,
    addExam,
    updateExam,
    deleteExam,
  };
};

