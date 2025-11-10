import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import type { Usuario } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UseUsuariosReturn {
    usuarios: Usuario[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createUsuario: (usuario: Omit<Usuario, 'id' | 'fecha_registro' | 'ultima_conexion'>) => Promise<boolean>;
    updateUsuario: (id: number, usuario: Partial<Omit<Usuario, 'id'>>) => Promise<boolean>;
    deleteUsuario: (id: number) => Promise<boolean>;
}

export const useUsuarios = (): UseUsuariosReturn => {
    const { isAuthenticated } = useAuth();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getUsuarios();

            if (response.success && response.data) {
                setUsuarios(response.data);
            } else {
                setError(response.error || 'Error al cargar usuarios');
                setUsuarios([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado
        if (isAuthenticated) {
            fetchUsuarios();
        }
    }, [isAuthenticated, fetchUsuarios]);

    const createUsuario = useCallback(async (
        usuario: Omit<Usuario, 'id' | 'fecha_registro' | 'ultima_conexion'>
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.createUsuario(usuario);

            if (response.success && response.data) {
                setUsuarios((prev) => [...prev, response.data!]);
                return true;
            } else {
                setError(response.error || 'Error al crear usuario');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const updateUsuario = useCallback(async (
        id: number,
        usuario: Partial<Omit<Usuario, 'id'>>
    ): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.updateUsuario(id, usuario);

            if (response.success && response.data) {
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === id ? response.data! : u))
                );
                return true;
            } else {
                setError(response.error || 'Error al actualizar usuario');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    const deleteUsuario = useCallback(async (id: number): Promise<boolean> => {
        setError(null);

        try {
            const response = await api.deleteUsuario(id);

            if (response.success) {
                setUsuarios((prev) => prev.filter((u) => u.id !== id));
                return true;
            } else {
                setError(response.error || 'Error al eliminar usuario');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return false;
        }
    }, []);

    return {
        usuarios,
        loading,
        error,
        refetch: fetchUsuarios,
        createUsuario,
        updateUsuario,
        deleteUsuario,
    };
};

