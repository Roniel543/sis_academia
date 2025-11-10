import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import type { Usuario } from '../types';

interface AuthContextType {
    user: Usuario | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sis_academia_user';
const TOKEN_KEY = 'sis_academia_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setUser(null);
        api.setToken(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
    };

    // Cargar usuario y token del localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        const savedToken = localStorage.getItem(TOKEN_KEY);

        if (savedUser && savedToken) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                // Configurar token en el servicio API
                api.setToken(savedToken);
                
                // Verificar si el token sigue siendo válido
                api.getMe().then((response: { success: boolean; data?: Usuario; error?: string }) => {
                    if (!response.success) {
                        // Token inválido, limpiar sesión
                        logout();
                    } else if (response.data) {
                        // Actualizar datos del usuario
                        setUser(response.data);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
                    }
                });
            } catch (error) {
                console.error('Error al cargar sesión:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    // Escuchar eventos de token expirado
    useEffect(() => {
        const handleTokenExpired = () => {
            logout();
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);
        return () => {
            window.removeEventListener('auth:token-expired', handleTokenExpired);
        };
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await api.login(email, password);

            if (response.success && response.data) {
                // La respuesta ahora incluye { user, token }
                const loginData = response.data as { user: Usuario; token: string };
                
                // IMPORTANTE: Guardar token PRIMERO antes de guardar usuario
                // Esto asegura que cuando los hooks se ejecuten, el token ya esté disponible
                localStorage.setItem(TOKEN_KEY, loginData.token);
                api.setToken(loginData.token); // Esto también guarda en localStorage y actualiza memoria
                
                // Luego guardar usuario
                setUser(loginData.user);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(loginData.user));
                
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: response.error || 'Email o contraseña incorrectos' 
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                error: 'Error de conexión con el servidor' 
            };
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    // Mostrar loading mientras se verifica la sesión
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

