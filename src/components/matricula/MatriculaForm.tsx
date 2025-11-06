import { useState, useEffect } from 'react';
import type { MatriculaUI } from '../../types';

interface MatriculaFormProps {
  enrollment: MatriculaUI | null;
  onSubmit: (enrollmentData: Omit<MatriculaUI, 'id'>) => void;
  onCancel: () => void;
}

export const MatriculaForm = ({ enrollment, onSubmit, onCancel }: MatriculaFormProps) => {
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    semester: '',
    status: 'pending' as 'enrolled' | 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (enrollment) {
      setFormData({
        student: enrollment.student,
        course: enrollment.course,
        semester: enrollment.semester,
        status: enrollment.status,
        date: enrollment.date,
      });
    }
  }, [enrollment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
        <input
          type="text"
          required
          value={formData.student}
          onChange={(e) => setFormData({ ...formData, student: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
        <input
          type="text"
          required
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
        <input
          type="text"
          required
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          placeholder="2024-1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as 'enrolled' | 'pending' })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pendiente</option>
          <option value="enrolled">Matriculado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

