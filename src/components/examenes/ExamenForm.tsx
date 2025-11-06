import { useState, useEffect } from 'react';
import type { ExamenUI } from '../../types';

interface ExamenFormProps {
  exam: ExamenUI | null;
  onSubmit: (examData: Omit<ExamenUI, 'id'>) => void;
  onCancel: () => void;
}

export const ExamenForm = ({ exam, onSubmit, onCancel }: ExamenFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    students: 0,
    status: 'scheduled' as 'scheduled' | 'completed',
  });

  useEffect(() => {
    if (exam) {
      setFormData({
        name: exam.name,
        course: exam.course,
        date: exam.date,
        duration: exam.duration,
        students: exam.students,
        status: exam.status,
      });
    }
  }, [exam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Examen</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
        <input
          type="text"
          required
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="2 horas"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Estudiantes</label>
        <input
          type="number"
          required
          min="0"
          value={formData.students}
          onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as 'scheduled' | 'completed' })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="scheduled">Programado</option>
          <option value="completed">Completado</option>
        </select>
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

