import { useState } from 'react';
import { Camera, Search } from 'lucide-react';
import type { AsistenciaUI } from '../../types';
import { QRScanner } from './QRScanner';
import { useMatriculas } from '../../hooks/useMatriculas';
import api from '../../services/api';

interface AsistenciaTabProps {
    attendance: AsistenciaUI[];
    onAddAttendance: (attendance: Omit<AsistenciaUI, 'id'>) => void;
}

export const AsistenciaTab = ({ attendance, onAddAttendance }: AsistenciaTabProps) => {
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { matriculas } = useMatriculas();

    const handleScanQR = async (qrCode: string) => {
        try {
            // Buscar carnet por código QR
            const response = await api.getCarnets({ codigo_qr: qrCode });
            
            if (response.success && response.data && response.data.length > 0) {
                const carnet = response.data[0];
                
                if (carnet) {
                    const usuarioId = carnet.usuario_id;

                    // Buscar matrículas del estudiante
                    const matriculasEstudiante = matriculas.filter(
                        (m: any) => m.estudiante?.usuario?.id === usuarioId
                    );

                    if (matriculasEstudiante.length > 0) {
                        // Usar la primera matrícula activa
                        const matricula = matriculasEstudiante.find(
                            (m: any) => m.estado === 'matriculado'
                        ) || matriculasEstudiante[0];

                        const matriculaData = matricula as any;

                        // Registrar asistencia automáticamente
                        const attendanceData: Omit<AsistenciaUI, 'id'> = {
                            student: matriculaData.estudiante?.usuario?.nombre_completo || 'Estudiante',
                            course: matriculaData.curso?.nombre || 'Curso',
                            date: new Date().toISOString().split('T')[0],
                            status: 'present',
                            qrCode: qrCode,
                            matricula_id: matriculaData.id,
                        } as any;

                        onAddAttendance(attendanceData);
                        setShowQRScanner(false);
                    } else {
                        alert('No se encontraron matrículas activas para este estudiante');
                    }
                } else {
                    alert('Código QR no encontrado. Asegúrate de que el estudiante tenga un carnet válido.');
                }
            } else {
                alert('Error al buscar el carnet. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al procesar QR:', error);
            alert('Error al procesar el código QR. Intenta nuevamente.');
        }
    };

    const filteredAttendance = attendance.filter((record) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            record.student.toLowerCase().includes(searchLower) ||
            record.course.toLowerCase().includes(searchLower) ||
            record.qrCode.toLowerCase().includes(searchLower) ||
            record.date.includes(searchTerm)
        );
    });

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Registro de Asistencia con QR</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Escanear Código QR</h3>
                            <p className="text-gray-600 mb-4">
                                Use la cámara para escanear el código QR del carnet del estudiante
                            </p>
                            <button
                                onClick={() => setShowQRScanner(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Abrir Escáner QR
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Instrucciones</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">1.</span>
                                    <span>Haz clic en "Abrir Escáner QR"</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">2.</span>
                                    <span>Permite el acceso a la cámara cuando se solicite</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">3.</span>
                                    <span>Apunta la cámara hacia el código QR del carnet</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">4.</span>
                                    <span>La asistencia se registrará automáticamente</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">Registros de Asistencia</h2>
                            <div className="flex-1 max-w-md ml-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar asistencias..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estudiante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Curso
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Código QR
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttendance.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                {attendance.length === 0
                                                    ? 'No hay registros de asistencia'
                                                    : 'No se encontraron registros con los filtros aplicados'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAttendance.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {record.student}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.course}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                    {record.qrCode.substring(0, 20)}...
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            record.status === 'present'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {record.status === 'present' ? 'Presente' : 'Ausente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showQRScanner && (
                <QRScanner
                    onScanSuccess={handleScanQR}
                    onClose={() => setShowQRScanner(false)}
                />
            )}
        </>
    );
};
