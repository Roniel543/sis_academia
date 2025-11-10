import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para gestionar exámenes
 * 
 * Qué hace
 * - Proporciona funciones para CRUD de exámenes
 * - Permite filtrar exámenes por curso, fecha, tipo o estado
 * - Maneja resultados de exámenes
 * - Maneja estados de loading y error
 * 
 * Uso:
 * const { examenes, loading, error, createExamen, updateExamen, deleteExamen, refresh } = useExamenes();
 * 
 * Para filtrar:
 * const { examenes } = useExamenes({ curso_id: 1, estado: 'programado' });
 */
export const useExamenes = (filters?: { curso_id?: number; fecha?: string; tipo?: string; estado?: string }) => {
    const { isAuthenticated } = useAuth();
    const [examenes, setExamenes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar exámenes al montar el hook o cuando cambien los filtros
    const loadExamenes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getExamenes(filters);
            
            if (response.success && response.data) {
                setExamenes(response.data);
            } else {
                setError(response.error || 'Error al cargar exámenes');
            }
        } catch (err) {
            setError('Error de conexión al cargar exámenes');
            console.error('Error en loadExamenes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            loadExamenes();
        }
    }, [isAuthenticated, filters?.curso_id, filters?.fecha, filters?.tipo, filters?.estado]);

    // Crear nuevo examen
    const createExamen = async (examenData: any) => {
        try {
            setError(null);
            const response = await api.createExamen(examenData);
            
            if (response.success) {
                // Recargar exámenes después de crear
                await loadExamenes();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al crear examen');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al crear examen';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Actualizar examen
    const updateExamen = async (id: number, examenData: any) => {
        try {
            setError(null);
            const response = await api.updateExamen(id, examenData);
            
            if (response.success) {
                // Recargar exámenes después de actualizar
                await loadExamenes();
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al actualizar examen');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al actualizar examen';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Eliminar examen
    const deleteExamen = async (id: number) => {
        try {
            setError(null);
            const response = await api.deleteExamen(id);
            
            if (response.success) {
                // Recargar exámenes después de eliminar
                await loadExamenes();
                return { success: true };
            } else {
                setError(response.error || 'Error al eliminar examen');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al eliminar examen';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Obtener resultados de un examen
    const getResultados = async (examenId: number) => {
        try {
            setError(null);
            const response = await api.getResultadosExamen(examenId);
            
            if (response.success && response.data) {
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al cargar resultados');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al cargar resultados';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Crear o actualizar resultado de examen
    const createOrUpdateResultado = async (examenId: number, resultadoData: any) => {
        try {
            setError(null);
            const response = await api.createOrUpdateResultado(examenId, resultadoData);
            
            if (response.success) {
                return { success: true, data: response.data };
            } else {
                setError(response.error || 'Error al guardar resultado');
                return { success: false, error: response.error };
            }
        } catch (err) {
            const errorMsg = 'Error de conexión al guardar resultado';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    return {
        examenes,
        loading,
        error,
        createExamen,
        updateExamen,
        deleteExamen,
        getResultados,
        createOrUpdateResultado,
        refresh: loadExamenes,
    };
};

