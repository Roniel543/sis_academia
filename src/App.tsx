import { Camera, Clipboard, CreditCard, FileText, User, BookOpen } from 'lucide-react';
import { useState } from 'react';
import './App.css';
import { AsistenciaTab } from './components/asistencia/AsistenciaTab';
import { Login } from './components/auth/Login';
import { CarnetTab } from './components/carnet/CarnetTab';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { CursosTab } from './components/cursos/CursosTab';
import { Dashboard } from './components/dashboard/Dashboard';
import { EstudiantesTab } from './components/estudiantes/EstudiantesTab';
import { ExamenesTab } from './components/examenes/ExamenesTab';
import { MatriculaTab } from './components/matricula/MatriculaTab';
import { UsuariosTab } from './components/usuarios/UsuariosTab';
import { useAuth } from './contexts/AuthContext';
import { useAppData } from './hooks/useAppData';
import { useCursos } from './hooks/useCursos';
import { useEstudiantes } from './hooks/useEstudiantes';

function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    users,
    enrollments,
    attendance,
    exams,
    stats,
    loading,
    errors,
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

  const {
    estudiantes,
    loading: estudiantesLoading,
    error: estudiantesError,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
  } = useEstudiantes();

  const {
    cursos,
    loading: cursosLoading,
    error: cursosError,
    createCurso,
    updateCurso,
    deleteCurso,
  } = useCursos();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'usuarios', label: 'Usuarios', icon: User },
    { id: 'estudiantes', label: 'Estudiantes', icon: User },
    { id: 'cursos', label: 'Cursos', icon: BookOpen },
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
          <Dashboard 
            stats={stats} 
            enrollments={enrollments} 
            exams={exams}
            loading={loading.stats}
            error={errors.stats}
          />
        )}

        {activeTab === 'usuarios' && (
          <UsuariosTab
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            loading={loading.usuarios}
            error={errors.usuarios}
          />
        )}

        {activeTab === 'estudiantes' && (
          <EstudiantesTab
            estudiantes={estudiantes}
            loading={estudiantesLoading}
            error={estudiantesError}
            onAddEstudiante={createEstudiante}
            onUpdateEstudiante={updateEstudiante}
            onDeleteEstudiante={deleteEstudiante}
          />
        )}

        {activeTab === 'cursos' && (
          <CursosTab
            cursos={cursos}
            loading={cursosLoading}
            error={cursosError}
            onAddCurso={createCurso}
            onUpdateCurso={updateCurso}
            onDeleteCurso={deleteCurso}
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
