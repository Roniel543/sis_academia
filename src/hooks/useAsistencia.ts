import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para gestionar asistencias
 *
 * Qué hace
 * - Proporciona funciones para CRUD de asistencias
 * - Permite filtrar asistencias por matrícula, fecha o estado
 * - Maneja estados de loading y error
 * 
 * Uso:
 * const { asistencias, loading, error, createAsistencia, updateAsistencia, deleteAsistencia, refresh } = useAsistencia();
 * 
 * Para filtrar:
 * const { asistencias } = useAsistencia({ matricula_id: 1, fecha: '2025-01-20' });
 */
export const useAsistencia = (filters?: { matricula_id?: number; fecha?: string; estado?: string }) => {
    const { isAuthenticated } = useAuth();
    const [asistencias, setAsistencias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar asistencias al montar el hook o cuando cambien los filtros
    const loadAsistencias = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getAsistencias(filters);
            
            if (response.success && response.data) {
                setAsistencias(response.data);
            } else {
                setError(response.error || 'Error al cargar asistencias');
            }
        } catch (err) {
            setError('Error de conexión al cargar asistencias');
            console.error('Error en loadAsistencias:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            loadAsistencias();
        }
    }, [isAuthenticated, filters?.matricula_id, filters?.fecha, filters?.estado]);

    // Crear nueva asistencia
    const createAsistencia = async (asistenciaData: any) => {
        try {
            setError(null);
            const response = await api.createAsistencia(asistenciaData);
            
            if (response.success) {
                // Recargar asistencias después de crear
                await loadAsistencias();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al crear asistencia');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al crear asistencia';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Actualizar asistencia
    const updateAsistencia = async (id: number, asistenciaData: any) => {
        try {
            setError(null);
            const response = await api.updateAsistencia(id, asistenciaData);
            
            if (response.success) {
                // Recargar asistencias después de actualizar
                await loadAsistencias();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al actualizar asistencia');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al actualizar asistencia';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Eliminar asistencia
    const deleteAsistencia = async (id: number) => {
        try {
            setError(null);
            const response = await api.deleteAsistencia(id);
            
            if (response.success) {
                // Recargar asistencias después de eliminar
                await loadAsistencias();
                return { success: true };
            } else {
                setError(response.error || 'Error al eliminar asistencia');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al eliminar asistencia';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    return {
        asistencias,
        loading,
        error,
        createAsistencia,
        updateAsistencia,
        deleteAsistencia,
        refresh: loadAsistencias,
    };
};

