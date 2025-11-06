import { User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  user?: string;
  children?: React.ReactNode;
}

export const Header = ({ title = 'Sistema Académico', user = 'Administrador', children }: HeaderProps) => {
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
              <span>Bienvenido, {user}</span>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

