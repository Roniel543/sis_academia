import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CheckCircle, AlertCircle } from 'lucide-react';

interface QRScannerProps {
    onScanSuccess: (qrCode: string) => void;
    onClose: () => void;
}

/**
 * Componente de escáner QR usando html5-qrcode
 * Permite escanear códigos QR desde la cámara del dispositivo
 */
export const QRScanner = ({ onScanSuccess, onClose }: QRScannerProps) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const scannerId = 'qr-reader';

    useEffect(() => {
        const startScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode(scannerId);
                scannerRef.current = html5QrCode;

                // Configuración del escáner
                const config = {
                    fps: 10, // Frames por segundo
                    qrbox: { width: 250, height: 250 }, // Tamaño del área de escaneo
                    aspectRatio: 1.0, // Aspecto cuadrado
                };

                // Iniciar escaneo desde la cámara trasera (o la disponible)
                await html5QrCode.start(
                    { facingMode: 'environment' }, // Cámara trasera
                    config,
                    (decodedText) => {
                        // Código QR escaneado exitosamente
                        setScannedCode(decodedText);
                        setIsScanning(false);
                        html5QrCode.stop();
                        onScanSuccess(decodedText);
                    },
                    () => {
                        // Ignorar errores de escaneo continuo (solo mostrar si es crítico)
                    }
                );

                setIsScanning(true);
                setError(null);
            } catch (err: any) {
                console.error('Error al iniciar escáner:', err);
                setError(
                    err.message?.includes('Permission denied') || err.message?.includes('NotAllowedError')
                        ? 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara.'
                        : 'Error al iniciar la cámara. Asegúrate de tener una cámara disponible.'
                );
                setIsScanning(false);
            }
        };

        startScanner();

        // Limpiar al desmontar
        return () => {
            if (scannerRef.current) {
                scannerRef.current
                    .stop()
                    .then(() => {
                        scannerRef.current?.clear();
                    })
                    .catch((err) => {
                        console.error('Error al detener escáner:', err);
                    });
            }
        };
    }, [onScanSuccess]);

    const handleStop = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error('Error al detener escáner:', err);
            }
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Escanear Código QR</h3>
                        <button
                            onClick={handleStop}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Error</p>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {scannedCode && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-green-800 font-medium">Código escaneado</p>
                                <p className="text-green-600 text-sm mt-1 font-mono">{scannedCode}</p>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <div
                            id={scannerId}
                            className="w-full rounded-lg overflow-hidden bg-gray-100"
                            style={{ minHeight: '300px' }}
                        />
                        {!isScanning && !error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                                <div className="text-center text-white">
                                    <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                                    <p>Iniciando cámara...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Instrucciones:</strong> Apunta la cámara hacia el código QR del estudiante.
                            El escáner detectará automáticamente el código.
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleStop}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

