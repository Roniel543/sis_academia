import { useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import type { Curso } from '../../types';
import { CursoForm } from './CursoForm';

interface CursosTabProps {
    cursos: Curso[];
    loading?: boolean;
    error?: string | null;
    onAddCurso: (curso: Omit<Curso, 'id'>) => void;
    onUpdateCurso: (id: number, curso: Partial<Omit<Curso, 'id'>>) => void;
    onDeleteCurso: (id: number) => void;
}

export const CursosTab = ({
    cursos,
    loading = false,
    error = null,
    onAddCurso,
    onUpdateCurso,
    onDeleteCurso,
}: CursosTabProps) => {
    const [showModal, setShowModal] = useState(false);
    const [currentCurso, setCurrentCurso] = useState<Curso | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNivel, setFilterNivel] = useState<string>('all');

    const handleEdit = (curso: Curso) => {
        setCurrentCurso(curso);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentCurso(null);
        setShowModal(true);
    };

    const handleSubmit = (cursoData: Omit<Curso, 'id'>) => {
        if (currentCurso) {
            onUpdateCurso(currentCurso.id, cursoData);
        } else {
            onAddCurso(cursoData);
        }
        setShowModal(false);
        setCurrentCurso(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este curso?')) {
            onDeleteCurso(id);
        }
    };

    const filteredCursos = cursos.filter((curso) => {
        const matchesSearch =
            curso.codigo_curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
            curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (curso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesNivel = filterNivel === 'all' || curso.nivel === filterNivel;
        return matchesSearch && matchesNivel;
    });

    const nivelesUnicos = Array.from(new Set(cursos.map((c) => c.nivel)));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando cursos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Gestión de Cursos</h2>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nuevo Curso</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Error al cargar cursos</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                )}

                <div className="flex space-x-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterNivel}
                        onChange={(e) => setFilterNivel(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todos los niveles</option>
                        {nivelesUnicos.map((nivel) => (
                            <option key={nivel} value={nivel}>
                                {nivel}
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
                                    Créditos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Horas/Semana
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nivel
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCursos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        {cursos.length === 0
                                            ? 'No hay cursos registrados. Crea tu primer curso.'
                                            : 'No se encontraron cursos que coincidan con la búsqueda.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCursos.map((curso) => (
                                    <tr key={curso.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900 font-mono">
                                                {curso.codigo_curso}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{curso.nombre}</div>
                                            {curso.descripcion && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {curso.descripcion}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{curso.creditos}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{curso.horas_semanales}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {curso.nivel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(curso)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(curso.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para crear/editar curso */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {currentCurso ? 'Editar Curso' : 'Nuevo Curso'}
                            </h3>
                            <CursoForm
                                curso={currentCurso}
                                onSubmit={handleSubmit}
                                onCancel={() => {
                                    setShowModal(false);
                                    setCurrentCurso(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

