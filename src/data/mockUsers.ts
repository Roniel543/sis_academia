// Usuarios de prueba para autenticación
import type { Usuario } from '../types';

export const mockUsers: Usuario[] = [
    {
        id: 1,
        nombre_completo: 'admin-vexler',
        email: 'admin-vexler@gmail.com',
        contrasena: 'admin123', // Por ahora es hardcodead
        rol: 'administrador',
        estado: 'activo',
        fecha_registro: '2025-01-20',
    },
];

// Función para buscar usuario por email y contraseña
export const validateUser = (email: string, password: string): Usuario | null => {
    const user = mockUsers.find(
        (u) => u.email === email && u.contrasena === password
    );

    if (user) {
        // Retornar usuario sin contraseña por seguridad
        const { contrasena, ...userWithoutPassword } = user;
        return userWithoutPassword as Usuario;
    }

    return null;
};

