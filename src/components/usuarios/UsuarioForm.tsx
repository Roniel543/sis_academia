import { useState, useEffect } from 'react';
import type { UsuarioUI, Rol, EstadoUsuario } from '../../types';

interface UsuarioFormProps {
  user: UsuarioUI | null;
  onSubmit: (userData: Omit<UsuarioUI, 'id'>) => void;
  onCancel: () => void;
}

export const UsuarioForm = ({ user, onSubmit, onCancel }: UsuarioFormProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    nombre_completo: string;
    email: string;
    rol: Rol;
    estado: EstadoUsuario;
    enrollmentDate: string;
  }>({
    name: '',
    nombre_completo: '',
    email: '',
    rol: 'estudiante',
    estado: 'activo',
    enrollmentDate: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
        enrollmentDate: user.enrollmentDate || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      nombre_completo: formData.nombre_completo || formData.name,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value, nombre_completo: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          value={formData.rol}
          onChange={(e) =>
            setFormData({
              ...formData,
              rol: e.target.value as Rol,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.estado}
          onChange={(e) =>
            setFormData({
              ...formData,
              estado: e.target.value as EstadoUsuario,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Alta</label>
        <input
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
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

