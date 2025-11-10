import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export const Header = ({ title = 'Sistema Académico', children }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {children}
            <div className="text-sm text-gray-600">
              <span>Bienvenido, {user?.nombre_completo || 'Usuario'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

