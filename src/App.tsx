import { useState } from 'react';
import { User, FileText, Camera, CreditCard, Clipboard } from 'lucide-react';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { Dashboard } from './components/dashboard/Dashboard';
import { UsuariosTab } from './components/usuarios/UsuariosTab';
import { MatriculaTab } from './components/matricula/MatriculaTab';
import { AsistenciaTab } from './components/asistencia/AsistenciaTab';
import { CarnetTab } from './components/carnet/CarnetTab';
import { ExamenesTab } from './components/examenes/ExamenesTab';
import { useAppData } from './hooks/useAppData';
import './App.css';

function App() {
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
