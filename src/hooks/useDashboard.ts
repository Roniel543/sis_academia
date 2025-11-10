import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import type { EstadisticasDashboard } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UseDashboardReturn {
    stats: EstadisticasDashboard | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState<EstadisticasDashboard | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getDashboardStats();

            if (response.success && response.data) {
                setStats(response.data);
            } else {
                setError(response.error || 'Error al cargar estadísticas');
                setStats(null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Solo hacer fetch si el usuario está autenticado sin esto saldra 401
        if (isAuthenticated) {
            fetchStats();
        }
    }, [isAuthenticated, fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
};

