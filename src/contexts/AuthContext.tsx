import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { validateUser } from '../data/mockUsers';
import type { Usuario } from '../types';

interface AuthContextType {
    user: Usuario | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sis_academia_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario del localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error al cargar usuario del localStorage:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const validatedUser = validateUser(email, password);

        if (validatedUser) {
            setUser(validatedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedUser));
            return { success: true };
        } else {
            return { success: false, error: 'Email o contraseña incorrectos' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
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

