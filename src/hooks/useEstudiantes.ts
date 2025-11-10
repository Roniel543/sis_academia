import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import type { Estudiante } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface EstudianteWithUsuario extends Estudiante {
    usuario?: {
        id: number;
        nombre_completo: string;
        email: string;
        rol: string;
        estado: string;
    };
}

interface UseEstudiantesReturn {
    estudiantes: EstudianteWithUsuario[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createEstudiante: (estudiante: Omit<Estudiante, 'id'> & { usuario_id: number }) => Promise<boolean>;
    updateEstudiante: (id: number, estudiante: Partial<Omit<Estudiante, 'id'>>) => Promise<boolean>;
    deleteEstudiante: (id: number) => Promise<boolean>;
}

export const useEstudiantes = (): UseEstudiantesReturn => {
    const { isAuthenticated } = useAuth();
    const [estudiantes, setEstudiantes] = useState<EstudianteWithUsuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEstudiantes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getEstudiantes();

            if (response.success && response.data) {
                setEstudiantes(response.data);
            } else {
                setError(response.error || 'Error al cargar estudiantes');
                setEstudiantes([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            setEstudiantes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            fetchEstudiantes();
        }
    }, [isAuthenticated, fetchEstudiantes]);

    const createEstudiante = useCallback(async (
        estudiante: Omit<Estudiante, 'id'> & { usuario_id: number }
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.createEstudiante(estudiante);

            if (response.success && response.data) {
                setEstudiantes((prev) => [...prev, response.data!]);
                return true;
            } else {
                setError(response.error || 'Error al crear estudiante');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const updateEstudiante = useCallback(async (
        id: number,
        estudiante: Partial<Omit<Estudiante, 'id'>>
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.updateEstudiante(id, estudiante);

            if (response.success && response.data) {
                setEstudiantes((prev) =>
                    prev.map((e) => (e.id === id ? response.data! : e))
                );
                return true;
            } else {
                setError(response.error || 'Error al actualizar estudiante');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const deleteEstudiante = useCallback(async (id: number): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.deleteEstudiante(id);

            if (response.success) {
                setEstudiantes((prev) => prev.filter((e) => e.id !== id));
                return true;
            } else {
                setError(response.error || 'Error al eliminar estudiante');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    return {
        estudiantes,
        loading,
        error,
        refetch: fetchEstudiantes,
        createEstudiante,
        updateEstudiante,
        deleteEstudiante,
    };
};

