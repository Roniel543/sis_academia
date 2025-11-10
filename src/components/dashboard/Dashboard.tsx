import { Calendar, Check, Clipboard, FileText, User } from 'lucide-react';
import type { EstadisticasDashboard, ExamenUI, MatriculaUI } from '../../types';
import { StatCard } from '../common/StatCard';

interface DashboardProps {
  stats: EstadisticasDashboard;
  enrollments: MatriculaUI[];
  exams: ExamenUI[];
  loading?: boolean;
  error?: string | null;
}

export const Dashboard = ({ stats, enrollments, exams, loading, error }: DashboardProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error al cargar estadísticas</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Estudiantes Totales"
          value={stats.totalStudents}
          icon={User}
          color="text-blue-500"
        />
        <StatCard
          title="Profesores"
          value={stats.totalTeachers}
          icon={User}
          color="text-green-500"
        />
        <StatCard
          title="Matrículas Activas"
          value={stats.activeEnrollments}
          icon={FileText}
          color="text-purple-500"
        />
        <StatCard
          title="Asistencia Promedio"
          value={`${stats.attendanceRate}%`}
          icon={Calendar}
          color="text-orange-500"
        />
        <StatCard
          title="Exámenes Programados"
          value={stats.examsScheduled}
          icon={Clipboard}
          color="text-red-500"
        />
        <StatCard
          title="Exámenes Completados"
          value={stats.examsCompleted}
          icon={Check}
          color="text-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {enrollments.slice(0, 3).map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{enrollment.student}</p>
                  <p className="text-sm text-gray-600">{enrollment.course}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${enrollment.status === 'enrolled'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {enrollment.status === 'enrolled' ? 'Matriculado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
          <div className="space-y-4">
            {exams
              .filter((e) => e.status === 'scheduled')
              .slice(0, 3)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{exam.name}</p>
                    <p className="text-sm text-gray-600">
                      {exam.date} • {exam.duration}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {exam.students} estudiantes
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

