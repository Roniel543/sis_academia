import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, Camera, CheckCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const isStoppedRef = useRef(false);
    const scannerId = 'qr-reader';

    useEffect(() => {
        let isMounted = true;
        let scannerInstance: Html5Qrcode | null = null;
        let isRunning = false;

        const startScanner = async () => {
            try {
                // Limpiar el contenedor antes de iniciar
                const container = document.getElementById(scannerId);
                if (container) {
                    container.innerHTML = '';
                }

                const html5QrCode = new Html5Qrcode(scannerId);
                scannerInstance = html5QrCode;
                scannerRef.current = html5QrCode;
                // Configuración del escáner
                const config = {
                    fps: 10, // Frames por segundo
                    qrbox: function (viewfinderWidth: number, viewfinderHeight: number) {
                        // Calcular el tamaño del cuadro de escaneo (80% del tamaño más pequeño)
                        const minEdgePercentage = 0.8;
                        const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                        const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                        return {
                            width: qrboxSize,
                            height: qrboxSize
                        };
                    },
                    aspectRatio: 1.0, // Aspecto cuadrado
                    disableFlip: false, // Permitir rotación
                };

                // Intentar primero con cámara trasera (móviles), luego frontal (PC)
                let cameraIdOrConfig: string | { facingMode: string } = { facingMode: 'environment' };

                // Para PC, intentar con cámara frontal primero
                try {
                    await html5QrCode.start(
                        cameraIdOrConfig,
                        config,
                        (decodedText) => {
                            // Código QR escaneado exitosamente
                            if (isMounted && !isStoppedRef.current) {
                                setScannedCode(decodedText);
                                setIsScanning(false);
                                isStoppedRef.current = true;
                                isRunning = false;
                                html5QrCode.stop().catch(() => { });
                                onScanSuccess(decodedText);
                            }
                        },
                        () => {
                            // Ignorar errores de escaneo continuo
                        }
                    );
                    isRunning = true;
                } catch (err: any) {
                    // Si falla con environment, intentar con user (cámara frontal)
                    if (err.message?.includes('environment')) {
                        cameraIdOrConfig = { facingMode: 'user' };
                        await html5QrCode.start(
                            cameraIdOrConfig,
                            config,
                            (decodedText) => {
                                if (isMounted && !isStoppedRef.current) {
                                    setScannedCode(decodedText);
                                    setIsScanning(false);
                                    isStoppedRef.current = true;
                                    isRunning = false;
                                    html5QrCode.stop().catch(() => { });
                                    onScanSuccess(decodedText);
                                }
                            },
                            () => { }
                        );
                        isRunning = true;
                    } else {
                        throw err;
                    }
                }

                if (isMounted) {
                    setIsScanning(true);
                    setError(null);
                }
            } catch (err: any) {
                console.error('Error al iniciar escáner:', err);
                if (isMounted) {
                    const errorMessage = err?.message || err?.toString() || '';
                    const errorName = err?.name || '';
                    
                    // Detectar diferentes tipos de errores de cámara
                    const isPermissionError = 
                        errorMessage.includes('Permission denied') || 
                        errorMessage.includes('NotAllowedError') ||
                        errorMessage.includes('permission') ||
                        errorName === 'NotAllowedError';
                    
                    const isNotFoundError = 
                        errorMessage.includes('NotFoundError') || 
                        errorMessage.includes('No camera') ||
                        errorMessage.includes('not found') ||
                        errorMessage.includes('no devices') ||
                        errorMessage.includes('DevicesNotFoundError') ||
                        errorName === 'NotFoundError' ||
                        errorName === 'DevicesNotFoundError';
                    
                    let errorText = '';
                    if (isPermissionError) {
                        errorText = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara.';
                    } else if (isNotFoundError) {
                        errorText = 'No se encontró ninguna cámara. Asegúrate de tener una cámara conectada.';
                    } else {
                        errorText = 'Error al iniciar la cámara. Asegúrate de tener una cámara disponible y permisos otorgados.';
                    }
                    
                    setError(errorText);
                    setIsScanning(false);
                }
            }
        };

        startScanner();

        // Limpiar al desmontar
        return () => {
            isMounted = false;
            isStoppedRef.current = true;
            if (scannerInstance && isRunning) {
                scannerInstance
                    .stop()
                    .then(() => {
                        scannerInstance?.clear();
                    })
                    .catch((err: any) => {
                        // Ignorar errores si el escáner no está corriendo
                        const errorMsg = err?.message || err?.toString() || '';
                        if (
                            !errorMsg.includes('not running') &&
                            !errorMsg.includes('not started') &&
                            !errorMsg.includes('Scanner is not running') &&
                            !errorMsg.includes('Scanner is not started') &&
                            !errorMsg.includes('Cannot stop')
                        ) {
                            console.error('Error al detener escáner:', err);
                        }
                    });
            } else if (scannerInstance) {
                // Limpiar aunque no esté corriendo
                try {
                    scannerInstance.clear();
                } catch {
                    // Ignorar errores de limpieza
                }
            }
        };
    }, [onScanSuccess]);

    const handleStop = async () => {
        isStoppedRef.current = true;
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err: any) {
                // Ignorar errores si el escáner no está corriendo
                const errorMsg = err?.message || err?.toString() || '';
                if (
                    !errorMsg.includes('not running') &&
                    !errorMsg.includes('not started') &&
                    !errorMsg.includes('Scanner is not running') &&
                    !errorMsg.includes('Scanner is not started') &&
                    !errorMsg.includes('Cannot stop')
                ) {
                    console.error('Error al detener escáner:', err);
                }
                // Intentar limpiar de todas formas
                try {
                    scannerRef.current.clear();
                } catch {
                    // Ignorar errores de limpieza
                }
            }
        }
        setIsScanning(false);
        onClose();
    };

    return (
        <>
            <style>{`
                #${scannerId} {
                    position: relative;
                    width: 100%;
                    min-height: 400px;
                }
                /* Asegurar que solo haya un video visible */
                #${scannerId} video {
                    width: 100% !important;
                    height: auto !important;
                    max-height: 500px !important;
                    object-fit: cover !important;
                    display: block !important;
                }
                /* Ocultar todos los videos excepto el primero */
                #${scannerId} video:not(:first-of-type) {
                    display: none !important;
                }
                #${scannerId} canvas {
                    display: none !important;
                }
                /* Estilizar el cuadro de escaneo QR */
                #${scannerId} div[class*="qr-shaded-region"] {
                    border: 3px solid #3b82f6 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5) !important;
                }
                /* Ocultar contenedores duplicados */
                #${scannerId} > div:not(:first-child) {
                    display: none !important;
                }
                /* Asegurar que solo haya un contenedor principal */
                #${scannerId} > div:first-child {
                    width: 100% !important;
                    position: relative !important;
                }
            `}</style>
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
                                style={{ minHeight: '400px' }}
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
        </>
    );
};

