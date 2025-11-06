import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Modal } from '../common/Modal';
import type { AsistenciaUI } from '../../types';
import { AsistenciaForm } from './AsistenciaForm';

interface AsistenciaTabProps {
  attendance: AsistenciaUI[];
  onAddAttendance: (attendance: Omit<AsistenciaUI, 'id'>) => void;
}

export const AsistenciaTab = ({ attendance, onAddAttendance }: AsistenciaTabProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleScanQR = () => {
    setShowModal(true);
  };

  const handleSubmit = (attendanceData: Omit<AsistenciaUI, 'id'>) => {
    onAddAttendance(attendanceData);
    setShowModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registro de Asistencia con QR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Escanear Código QR</h3>
              <p className="text-gray-600 mb-4">
                Use la cámara para escanear el código QR del estudiante
              </p>
              <button
                onClick={handleScanQR}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simular Escaneo QR
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Código QR de Ejemplo</h3>
              <div className="bg-white p-4 rounded-lg flex justify-center">
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-xs text-gray-500 text-center">
                    QR<br />
                    STUDENT-001
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Código QR: QR123456</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Registros de Asistencia</h2>
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
                  {attendance.map((record) => (
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
                        {record.qrCode}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Asistencia"
      >
        <AsistenciaForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

