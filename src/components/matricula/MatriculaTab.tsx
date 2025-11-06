import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import type { MatriculaUI } from '../../types';
import { MatriculaForm } from './MatriculaForm';

interface MatriculaTabProps {
  enrollments: MatriculaUI[];
  onAddEnrollment: (enrollment: Omit<MatriculaUI, 'id'>) => void;
  onUpdateEnrollment: (id: number, enrollment: Partial<MatriculaUI>) => void;
  onDeleteEnrollment: (id: number) => void;
}

export const MatriculaTab = ({
  enrollments,
  onAddEnrollment,
  onUpdateEnrollment,
  onDeleteEnrollment,
}: MatriculaTabProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<MatriculaUI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const handleEdit = (enrollment: MatriculaUI) => {
    setCurrentEnrollment(enrollment);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentEnrollment(null);
    setShowModal(true);
  };

  const handleSubmit = (enrollmentData: Omit<MatriculaUI, 'id'>) => {
    if (currentEnrollment) {
      onUpdateEnrollment(currentEnrollment.id, enrollmentData);
    } else {
      onAddEnrollment(enrollmentData);
    }
    setShowModal(false);
    setCurrentEnrollment(null);
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || enrollment.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(enrollments.map((e) => e.course)));

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Matrículas</h2>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Matrícula</span>
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar matrículas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los cursos</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semestre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{enrollment.student}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.status === 'enrolled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {enrollment.status === 'enrolled' ? 'Matriculado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(enrollment)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEnrollment(enrollment.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentEnrollment(null);
        }}
        title={currentEnrollment ? 'Editar Matrícula' : 'Nueva Matrícula'}
      >
        <MatriculaForm
          enrollment={currentEnrollment}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setCurrentEnrollment(null);
          }}
        />
      </Modal>
    </>
  );
};

