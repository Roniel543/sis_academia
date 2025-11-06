import { useState } from 'react';
import type { AsistenciaUI } from '../../types';

interface AsistenciaFormProps {
  onSubmit: (attendanceData: Omit<AsistenciaUI, 'id'>) => void;
  onCancel: () => void;
}

export const AsistenciaForm = ({ onSubmit, onCancel }: AsistenciaFormProps) => {
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent',
    qrCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Código QR</label>
        <input
          type="text"
          required
          value={formData.qrCode}
          onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
          placeholder="Escanea o ingresa el código QR"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as 'present' | 'absent' })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="present">Presente</option>
          <option value="absent">Ausente</option>
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

