import { QRCodeSVG } from 'qrcode.react';
import { User } from 'lucide-react';

interface Carnet {
    id: number;
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

interface CarnetPreviewProps {
    carnet: Carnet;
}

/**
 * Componente de vista previa del carnet para impresión
 * Diseño tipo tarjeta de identificación
 */
export const CarnetPreview = ({ carnet }: CarnetPreviewProps) => {
    const isVencido = new Date(carnet.fecha_vencimiento) < new Date();
    const diasRestantes = Math.ceil(
        (new Date(carnet.fecha_vencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-white p-8 w-full">
            {/* Vista para impresión - tamaño estándar de carnet (85.6mm x 53.98mm) */}
            <div
                className="mx-auto border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg"
                style={{
                    width: '85.6mm',
                    minWidth: '85.6mm',
                    height: '53.98mm',
                    minHeight: '53.98mm',
                    maxWidth: '100%',
                }}
            >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">COLEGIO VEXLER</h3>
                        <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded font-semibold">
                            {carnet.estado.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Contenido del carnet */}
                <div className="p-4 bg-white">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                {carnet.usuario?.nombre_completo || 'Usuario'}
                            </h4>
                            <p className="text-xs text-gray-600 capitalize">{carnet.usuario?.rol || '-'}</p>
                            <p className="text-xs text-gray-500 font-mono">{carnet.codigo_carnet}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center items-center space-x-4 flex-wrap">
                        <div className="bg-gray-50 p-2 rounded border border-gray-200 flex-shrink-0">
                            <QRCodeSVG
                                value={carnet.codigo_qr}
                                size={80}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <div className="flex-1 text-xs text-gray-600">
                            <div className="mb-1">
                                <strong>Expedición:</strong>{' '}
                                {new Date(carnet.fecha_expedicion).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Vencimiento:</strong>{' '}
                                {new Date(carnet.fecha_vencimiento).toLocaleDateString()}
                            </div>
                            {isVencido ? (
                                <div className="text-red-600 font-semibold mt-1">⚠ VENCIDO</div>
                            ) : (
                                <div className="text-green-600 mt-1">
                                    {diasRestantes} días restantes
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Información adicional (no se imprime) */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 break-words" style={{ marginBottom: '3rem' }}>
                <p className="mb-3">
                    <strong>Código QR:</strong>
                </p>
                <p className="font-mono text-xs break-all bg-white p-2 rounded border border-gray-200 mb-3">
                    {carnet.codigo_qr}
                </p>
                <p className="mb-2">
                    <strong>Email:</strong> {carnet.usuario?.email || '-'}
                </p>
            </div>
        </div>
    );
};

