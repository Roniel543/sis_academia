import { User } from 'lucide-react';
import type { UsuarioUI } from '../../types';

interface CarnetTabProps {
  users: UsuarioUI[];
}

export const CarnetTab = ({ users }: CarnetTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generación de Carnets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.slice(0, 6).map((user) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{user.rol}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono">STU{user.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className={user.estado === 'activo' ? 'text-green-600' : 'text-red-600'}>
                    {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Desde:</span>
                  <span>{user.enrollmentDate || '-'}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full h-8 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-600">QR Code</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

