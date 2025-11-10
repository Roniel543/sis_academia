import { useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import type { Estudiante } from '../../types';
import { EstudianteForm } from './EstudianteForm';
import { useUsuarios } from '../../hooks/useUsuarios';

interface EstudianteWithUsuario extends Estudiante {
    usuario?: {
        id: number;
        nombre_completo: string;
        email: string;
        rol: string;
        estado: string;
    };
}

interface EstudiantesTabProps {
    estudiantes: EstudianteWithUsuario[];
    loading?: boolean;
    error?: string | null;
    onAddEstudiante: (estudiante: Omit<Estudiante, 'id'> & { usuario_id: number }) => void;
    onUpdateEstudiante: (id: number, estudiante: Partial<Omit<Estudiante, 'id'>>) => void;
    onDeleteEstudiante: (id: number) => void;
}

export const EstudiantesTab = ({
    estudiantes,
    loading = false,
    error = null,
    onAddEstudiante,
    onUpdateEstudiante,
    onDeleteEstudiante,
}: EstudiantesTabProps) => {
    const [showModal, setShowModal] = useState(false);
    const [currentEstudiante, setCurrentEstudiante] = useState<EstudianteWithUsuario | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCarrera, setFilterCarrera] = useState<string>('all');

    const { usuarios } = useUsuarios();

    const handleEdit = (estudiante: EstudianteWithUsuario) => {
        setCurrentEstudiante(estudiante);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentEstudiante(null);
        setShowModal(true);
    };

    const handleSubmit = (estudianteData: Omit<Estudiante, 'id'> & { usuario_id: number }) => {
        if (currentEstudiante) {
            onUpdateEstudiante(currentEstudiante.id, estudianteData);
        } else {
            onAddEstudiante(estudianteData);
        }
        setShowModal(false);
        setCurrentEstudiante(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
            onDeleteEstudiante(id);
        }
    };

    const filteredEstudiantes = estudiantes.filter((estudiante) => {
        const matchesSearch =
            estudiante.codigo_estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.usuario?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.usuario?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCarrera = filterCarrera === 'all' || estudiante.carrera === filterCarrera;
        return matchesSearch && matchesCarrera;
    });

    const carrerasUnicas = Array.from(new Set(estudiantes.map((e) => e.carrera)));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Gestión de Estudiantes</h2>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nuevo Estudiante</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Error al cargar estudiantes</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                )}

                <div className="flex space-x-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar estudiantes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterCarrera}
                        onChange={(e) => setFilterCarrera(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todas las carreras</option>
                        {carrerasUnicas.map((carrera) => (
                            <option key={carrera} value={carrera}>
                                {carrera}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Carrera
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Semestre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEstudiantes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {estudiantes.length === 0
                                            ? 'No hay estudiantes registrados'
                                            : 'No se encontraron estudiantes con los filtros aplicados'}
                                    </td>
                                </tr>
                            ) : (
                                filteredEstudiantes.map((estudiante) => (
                                    <tr key={estudiante.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {estudiante.codigo_estudiante}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {estudiante.usuario?.nombre_completo || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{estudiante.usuario?.email || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{estudiante.carrera}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{estudiante.semestre}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{estudiante.telefono || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(estudiante)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(estudiante.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {currentEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                            </h3>
                            <EstudianteForm
                                estudiante={currentEstudiante as any}
                                usuarios={usuarios}
                                onSubmit={handleSubmit}
                                onCancel={() => {
                                    setShowModal(false);
                                    setCurrentEstudiante(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

