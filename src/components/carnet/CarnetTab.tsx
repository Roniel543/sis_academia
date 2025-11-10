import { useState, useRef, useEffect } from 'react';
import { Plus, Printer, Eye, Edit, Trash2, Search } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import type { UsuarioUI } from '../../types';
import api from '../../services/api';
import { CarnetForm } from './CarnetForm';
import { CarnetPreview } from './CarnetPreview';

interface Carnet {
    id: number;
    usuario_id: number;
    codigo_carnet: string;
    codigo_qr: string;
    fecha_expedicion: string;
    fecha_vencimiento: string;
    estado: 'activo' | 'vencido' | 'suspendido';
    usuario?: {
        id: number;
        nombre_completo: string;
        email: string;
        rol: string;
    };
}

interface CarnetTabProps {
    users: UsuarioUI[];
}

export const CarnetTab = ({ users }: CarnetTabProps) => {
    const [carnets, setCarnets] = useState<Carnet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentCarnet, setCurrentCarnet] = useState<Carnet | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('all');
    const printRef = useRef<HTMLDivElement>(null);

    const loadCarnets = async () => {
        try {
            setLoading(true);
            const response = await api.getCarnets();
            if (response.success && response.data) {
                setCarnets(response.data);
            }
        } catch (error) {
            console.error('Error al cargar carnets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCarnets();
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Carnet-${currentCarnet?.codigo_carnet || 'Nuevo'}`,
    });

    const handleAdd = () => {
        setCurrentCarnet(null);
        setShowModal(true);
    };

    const handleEdit = (carnet: Carnet) => {
        setCurrentCarnet(carnet);
        setShowModal(true);
    };

    const handlePreview = (carnet: Carnet) => {
        setCurrentCarnet(carnet);
        setShowPreview(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este carnet?')) {
            try {
                const response = await api.deleteCarnet(id);
                if (response.success) {
                    await loadCarnets();
                }
            } catch (error) {
                console.error('Error al eliminar carnet:', error);
                alert('Error al eliminar el carnet');
            }
        }
    };

    const handleSubmit = async (carnetData: any) => {
        try {
            if (currentCarnet) {
                await api.updateCarnet(currentCarnet.id, carnetData);
            } else {
                await api.createCarnet(carnetData);
            }
            await loadCarnets();
            setShowModal(false);
            setCurrentCarnet(null);
        } catch (error) {
            console.error('Error al guardar carnet:', error);
            alert('Error al guardar el carnet');
        }
    };

    const filteredCarnets = carnets.filter((carnet) => {
        const matchesSearch =
            carnet.codigo_carnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
            carnet.usuario?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            carnet.usuario?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === 'all' || carnet.estado === filterEstado;
        return matchesSearch && matchesEstado;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando carnets...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Gestión de Carnets</h2>
                        <button
                            onClick={handleAdd}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Nuevo Carnet</span>
                        </button>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar carnets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="vencido">Vencido</option>
                            <option value="suspendido">Suspendido</option>
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
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expedición
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vencimiento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCarnets.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {carnets.length === 0
                                                ? 'No hay carnets registrados'
                                                : 'No se encontraron carnets con los filtros aplicados'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCarnets.map((carnet) => (
                                        <tr key={carnet.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {carnet.codigo_carnet}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {carnet.usuario?.nombre_completo || '-'}
                                                </div>
                                                <div className="text-sm text-gray-500">{carnet.usuario?.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(carnet.fecha_expedicion).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(carnet.fecha_vencimiento).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        carnet.estado === 'activo'
                                                            ? 'bg-green-100 text-green-800'
                                                            : carnet.estado === 'vencido'
                                                              ? 'bg-red-100 text-red-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {carnet.estado === 'activo'
                                                        ? 'Activo'
                                                        : carnet.estado === 'vencido'
                                                          ? 'Vencido'
                                                          : 'Suspendido'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handlePreview(carnet)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Vista previa"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(carnet)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(carnet.id)}
                                                        className="text-red-600 hover:text-red-900"
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
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {currentCarnet ? 'Editar Carnet' : 'Nuevo Carnet'}
                            </h3>
                <CarnetForm
                    carnet={currentCarnet}
                    users={users}
                    existingCarnets={carnets}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setCurrentCarnet(null);
                    }}
                />
                        </div>
                    </div>
                </div>
            )}

            {showPreview && currentCarnet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto" style={{ padding: '2rem' }}>
                    <div className="flex justify-center min-h-full py-8">
                        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-auto">
                            <div className="p-6 pb-12">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Vista Previa del Carnet</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Printer className="h-5 w-5" />
                                            <span>Imprimir</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPreview(false);
                                                setCurrentCarnet(null);
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div ref={printRef} className="w-full">
                                        <CarnetPreview carnet={currentCarnet} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
