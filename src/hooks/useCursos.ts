import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import type { Curso } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UseCursosReturn {
    cursos: Curso[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createCurso: (curso: Omit<Curso, 'id'>) => Promise<boolean>;
    updateCurso: (id: number, curso: Partial<Omit<Curso, 'id'>>) => Promise<boolean>;
    deleteCurso: (id: number) => Promise<boolean>;
}

export const useCursos = (): UseCursosReturn => {
    const { isAuthenticated } = useAuth();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCursos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getCursos();

            if (response.success && response.data) {
                setCursos(response.data);
            } else {
                setError(response.error || 'Error al cargar cursos');
                setCursos([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            setCursos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            fetchCursos();
        }
    }, [isAuthenticated, fetchCursos]);

    const createCurso = useCallback(async (
        curso: Omit<Curso, 'id'>
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.createCurso(curso);

            if (response.success && response.data) {
                setCursos((prev) => [...prev, response.data!]);
                return true;
            } else {
                setError(response.error || 'Error al crear curso');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const updateCurso = useCallback(async (
        id: number,
        curso: Partial<Omit<Curso, 'id'>>
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.updateCurso(id, curso);

            if (response.success && response.data) {
                setCursos((prev) =>
                    prev.map((c) => (c.id === id ? response.data! : c))
                );
                return true;
            } else {
                setError(response.error || 'Error al actualizar curso');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const deleteCurso = useCallback(async (id: number): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.deleteCurso(id);

            if (response.success) {
                setCursos((prev) => prev.filter((c) => c.id !== id));
                return true;
            } else {
                setError(response.error || 'Error al eliminar curso');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    return {
        cursos,
        loading,
        error,
        refetch: fetchCursos,
        createCurso,
        updateCurso,
        deleteCurso,
    };
};

