import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para gestionar matrículas
 * 
 * Qué hace
 * - Proporciona funciones para CRUD de matrículas
 * - Maneja estados de loading y error
 * - Carga automáticamente las matrículas al montar el componente
 * 
 * Uso:
 * const { matriculas, loading, error, createMatricula, updateMatricula, deleteMatricula, refresh } = useMatriculas();
 */
export const useMatriculas = () => {
    const { isAuthenticated } = useAuth();
    const [matriculas, setMatriculas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar matrículas al montar el hook
    const loadMatriculas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getMatriculas();
            
            if (response.success && response.data) {
                setMatriculas(response.data);
            } else {
                setError(response.error || 'Error al cargar matrículas');
            }
        } catch (err) {
            setError('Error de conexión al cargar matrículas');
            console.error('Error en loadMatriculas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            loadMatriculas();
        }
    }, [isAuthenticated]);

    // Crear nueva matrícula
    const createMatricula = async (matriculaData: any) => {
        try {
            setError(null);
            const response = await api.createMatricula(matriculaData);
            
            if (response.success) {
                // Recargar matrículas después de crear
                await loadMatriculas();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al crear matrícula');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al crear matrícula';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Actualizar matrícula
    const updateMatricula = async (id: number, matriculaData: any) => {
        try {
            setError(null);
            const response = await api.updateMatricula(id, matriculaData);
            
            if (response.success) {
                // Recargar matrículas después de actualizar
                await loadMatriculas();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al actualizar matrícula');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al actualizar matrícula';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Eliminar matrícula
    const deleteMatricula = async (id: number) => {
        try {
            setError(null);
            const response = await api.deleteMatricula(id);
            
            if (response.success) {
                // Recargar matrículas después de eliminar
                await loadMatriculas();
                return { success: true };
            } else {
                setError(response.error || 'Error al eliminar matrícula');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al eliminar matrícula';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    return {
        matriculas,
        loading,
        error,
        createMatricula,
        updateMatricula,
        deleteMatricula,
        refresh: loadMatriculas,
    };
};

