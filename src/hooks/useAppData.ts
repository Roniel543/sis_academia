import { useState } from 'react';
import type {
  UsuarioUI,
  MatriculaUI,
  AsistenciaUI,
  ExamenUI,
  EstadisticasDashboard,
} from '../types';

// Datos iniciales mock
const initialUsers: UsuarioUI[] = [
  {
    id: 1,
    name: 'CaAArlos Rodriguez',
    nombre_completo: 'Carlos Rodríguez',
    email: 'carlos@university.edu',
    rol: 'estudiante',
    estado: 'activo',
    enrollmentDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'María González',
    nombre_completo: 'María González',
    email: 'maria@university.edu',
    rol: 'profesor',
    estado: 'activo',
    enrollmentDate: '2023-08-20',
  },
  {
    id: 3,
    name: 'Juan Pérez',
    nombre_completo: 'Juan Pérez',
    email: 'juan@university.edu',
    rol: 'estudiante',
    estado: 'inactivo',
    enrollmentDate: '2024-02-01',
  },
];

const initialEnrollments: MatriculaUI[] = [
  {
    id: 1,
    student: 'Carlos Rodríguez',
    course: 'Matemáticas Avanzadas',
    semester: '2024-1',
    status: 'enrolled',
    date: '2024-01-20',
  },
  {
    id: 2,
    student: 'Ana Martínez',
    course: 'Literatura Hispanoamericana',
    semester: '2024-1',
    status: 'pending',
    date: '2024-01-22',
  },
  {
    id: 3,
    student: 'Luis Sánchez',
    course: 'Física Cuántica',
    semester: '2024-1',
    status: 'enrolled',
    date: '2024-01-25',
  },
];

const initialAttendance: AsistenciaUI[] = [
  {
    id: 1,
    student: 'Carlos Rodríguez',
    course: 'Matemáticas Avanzadas',
    date: '2024-03-15',
    status: 'present',
    qrCode: 'QR123456',
  },
  {
    id: 2,
    student: 'Ana Martínez',
    course: 'Literatura Hispanoamericana',
    date: '2024-03-15',
    status: 'absent',
    qrCode: 'QR789012',
  },
  {
    id: 3,
    student: 'Luis Sánchez',
    course: 'Física Cuántica',
    date: '2024-03-15',
    status: 'present',
    qrCode: 'QR345678',
  },
];

const initialExams: ExamenUI[] = [
  {
    id: 1,
    name: 'Examen Final - Matemáticas',
    course: 'Matemáticas Avanzadas',
    date: '2024-06-15',
    duration: '2 horas',
    students: 45,
    status: 'scheduled',
  },
  {
    id: 2,
    name: 'Simulacro Parcial - Literatura',
    course: 'Literatura Hispanoamericana',
    date: '2024-04-10',
    duration: '1.5 horas',
    students: 32,
    status: 'completed',
  },
  {
    id: 3,
    name: 'Prueba de Conceptos - Física',
    course: 'Física Cuántica',
    date: '2024-05-20',
    duration: '3 horas',
    students: 28,
    status: 'scheduled',
  },
];

const initialStats: EstadisticasDashboard = {
  totalStudents: 1250,
  totalTeachers: 85,
  activeEnrollments: 980,
  attendanceRate: 92.5,
  examsScheduled: 12,
  examsCompleted: 8,
};

export const useAppData = () => {
  const [users, setUsers] = useState<UsuarioUI[]>(initialUsers);
  const [enrollments, setEnrollments] = useState<MatriculaUI[]>(initialEnrollments);
  const [attendance, setAttendance] = useState<AsistenciaUI[]>(initialAttendance);
  const [exams, setExams] = useState<ExamenUI[]>(initialExams);
  const [stats, setStats] = useState<EstadisticasDashboard>(initialStats);

  // Usuarios
  const addUser = (user: Omit<UsuarioUI, 'id'>) => {
    const newUser: UsuarioUI = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    };
    setUsers([...users, newUser]);
    updateStats();
  };

  const updateUser = (id: number, userData: Partial<UsuarioUI>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    updateStats();
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    updateStats();
  };

  // Matrículas
  const addEnrollment = (enrollment: Omit<MatriculaUI, 'id'>) => {
    const newEnrollment: MatriculaUI = {
      ...enrollment,
      id:
        enrollments.length > 0
          ? Math.max(...enrollments.map((e) => e.id)) + 1
          : 1,
    };
    setEnrollments([...enrollments, newEnrollment]);
    updateStats();
  };

  const updateEnrollment = (id: number, enrollmentData: Partial<MatriculaUI>) => {
    setEnrollments(
      enrollments.map((e) => (e.id === id ? { ...e, ...enrollmentData } : e))
    );
    updateStats();
  };

  const deleteEnrollment = (id: number) => {
    setEnrollments(enrollments.filter((e) => e.id !== id));
    updateStats();
  };

  // Asistencia
  const addAttendance = (attendanceData: Omit<AsistenciaUI, 'id'>) => {
    const newAttendance: AsistenciaUI = {
      ...attendanceData,
      id:
        attendance.length > 0
          ? Math.max(...attendance.map((a) => a.id)) + 1
          : 1,
    };
    setAttendance([...attendance, newAttendance]);
    updateStats();
  };

  // Exámenes
  const addExam = (exam: Omit<ExamenUI, 'id'>) => {
    const newExam: ExamenUI = {
      ...exam,
      id: exams.length > 0 ? Math.max(...exams.map((e) => e.id)) + 1 : 1,
    };
    setExams([...exams, newExam]);
    updateStats();
  };

  const updateExam = (id: number, examData: Partial<ExamenUI>) => {
    setExams(exams.map((e) => (e.id === id ? { ...e, ...examData } : e)));
    updateStats();
  };

  const deleteExam = (id: number) => {
    setExams(exams.filter((e) => e.id !== id));
    updateStats();
  };

  // Actualizar estadísticas
  const updateStats = () => {
    setStats({
      totalStudents: users.filter((u) => u.rol === 'estudiante').length,
      totalTeachers: users.filter((u) => u.rol === 'profesor').length,
      activeEnrollments: enrollments.filter((e) => e.status === 'enrolled').length,
      attendanceRate: stats.attendanceRate, // Mantener por ahora
      examsScheduled: exams.filter((e) => e.status === 'scheduled').length,
      examsCompleted: exams.filter((e) => e.status === 'completed').length,
    });
  };

  return {
    users,
    enrollments,
    attendance,
    exams,
    stats,
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

