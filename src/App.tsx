import { Camera, Clipboard, CreditCard, FileText, User } from 'lucide-react';
import { useState } from 'react';
import './App.css';
import { AsistenciaTab } from './components/asistencia/AsistenciaTab';
import { Login } from './components/auth/Login';
import { CarnetTab } from './components/carnet/CarnetTab';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExamenesTab } from './components/examenes/ExamenesTab';
import { MatriculaTab } from './components/matricula/MatriculaTab';
import { UsuariosTab } from './components/usuarios/UsuariosTab';
import { useAuth } from './contexts/AuthContext';
import { useAppData } from './hooks/useAppData';

function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    users,
    enrollments,
    attendance,
    exams,
    stats,
    addUser,
    updateUser,
    deleteUser,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    addAttendance,
    addExam,
    updateExam,
    deleteExam,
  } = useAppData();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'usuarios', label: 'Usuarios', icon: User },
    { id: 'matricula', label: 'Matrícula', icon: FileText },
    { id: 'asistencia', label: 'Asistencia QR', icon: Camera },
    { id: 'carnet', label: 'Carnet', icon: CreditCard },
    { id: 'examenes', label: 'Exámenes', icon: Clipboard },
  ];

  // Si no hay usuario logueado, mostrar login
  if (!user) {
    return <Login />;
  }

  // Si hay usuario logueado, mostrar el dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} enrollments={enrollments} exams={exams} />
        )}

        {activeTab === 'usuarios' && (
          <UsuariosTab
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        )}

        {activeTab === 'matricula' && (
          <MatriculaTab
            enrollments={enrollments}
            onAddEnrollment={addEnrollment}
            onUpdateEnrollment={updateEnrollment}
            onDeleteEnrollment={deleteEnrollment}
          />
        )}

        {activeTab === 'asistencia' && (
          <AsistenciaTab attendance={attendance} onAddAttendance={addAttendance} />
        )}

        {activeTab === 'carnet' && <CarnetTab users={users} />}

        {activeTab === 'examenes' && (
          <ExamenesTab
            exams={exams}
            onAddExam={addExam}
            onUpdateExam={updateExam}
            onDeleteExam={deleteExam}
          />
        )}
      </div>
    </div>
  );
}

export default App;
