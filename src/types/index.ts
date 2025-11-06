// Tipos para el sistema académico

export type Rol = 'estudiante' | 'profesor' | 'administrador';
export type EstadoUsuario = 'activo' | 'inactivo';
export type EstadoMatricula = 'matriculado' | 'pendiente' | 'cancelado' | 'completado';
export type EstadoAsistencia = 'presente' | 'ausente' | 'tardio';
export type EstadoExamen = 'programado' | 'completado' | 'cancelado';
export type EstadoResultado = 'presentado' | 'ausente' | 'reprobado';
export type TipoExamen = 'parcial' | 'final' | 'simulacro' | 'quiz';
export type EstadoCarnet = 'activo' | 'vencido' | 'suspendido';

export interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  contrasena?: string;
  rol: Rol;
  estado: EstadoUsuario;
  fecha_registro?: string;
  ultima_conexion?: string;
}

export interface Estudiante {
  id: number;
  codigo_estudiante: string;
  carrera: string;
  semestre: number;
  telefono?: string;
  direccion?: string;
}

export interface Profesor {
  id: number;
  codigo_profesor: string;
  departamento: string;
  especialidad?: string;
  titulo: string;
}

export interface Curso {
  id: number;
  codigo_curso: string;
  nombre: string;
  descripcion?: string;
  creditos: number;
  horas_semanales: number;
  nivel: string;
}

export interface Matricula {
  id: number;
  estudiante_id: number;
  curso_id: number;
  semestre: string;
  estado: EstadoMatricula;
  fecha_matricula?: string;
  nota_final?: number;
  estudiante?: Usuario;
  curso?: Curso;
}

export interface Asistencia {
  id: number;
  matricula_id: number;
  codigo_qr: string;
  fecha: string;
  hora_entrada: string;
  estado: EstadoAsistencia;
  observaciones?: string;
  matricula?: Matricula;
}

export interface Examen {
  id: number;
  curso_id: number;
  nombre: string;
  tipo: TipoExamen;
  fecha: string;
  hora_inicio: string;
  duracion_minutos: number;
  estado: EstadoExamen;
  puntaje_total: number;
  curso?: Curso;
}

export interface ResultadoExamen {
  id: number;
  examen_id: number;
  matricula_id: number;
  puntaje_obtenido: number;
  fecha_presentacion?: string;
  estado: EstadoResultado;
  examen?: Examen;
  matricula?: Matricula;
}

export interface Carnet {
  id: number;
  usuario_id: number;
  codigo_carnet: string;
  codigo_qr: string;
  fecha_expedicion: string;
  fecha_vencimiento: string;
  estado: EstadoCarnet;
  usuario?: Usuario;
}

// Tipos para la UI
export interface UsuarioUI extends Usuario {
  name: string;
  enrollmentDate?: string;
}

export interface MatriculaUI {
  id: number;
  student: string;
  course: string;
  semester: string;
  status: 'enrolled' | 'pending';
  date: string;
}

export interface AsistenciaUI {
  id: number;
  student: string;
  course: string;
  date: string;
  status: 'present' | 'absent';
  qrCode: string;
}

export interface ExamenUI {
  id: number;
  name: string;
  course: string;
  date: string;
  duration: string;
  students: number;
  status: 'scheduled' | 'completed';
}

export interface EstadisticasDashboard {
  totalStudents: number;
  totalTeachers: number;
  activeEnrollments: number;
  attendanceRate: number;
  examsScheduled: number;
  examsCompleted: number;
}

