import jwt from 'jsonwebtoken';

/**
 * Utilidades para manejo de JWT
 * 
 * Qué hace
 * - Genera tokens JWT para autenticación
 * - Verifica tokens JWT en requests
 * - Extrae información del usuario del token
 */

const JWT_SECRET = process.env.JWT_SECRET || 'sistema_academico_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 días por defecto

/**
 * Interfaz para el payload del token
 */
export interface TokenPayload {
    userId: number;
    email: string;
    rol: string;
}

/**
 * Genera un token JWT para un usuario
 * 
 * @param payload - Datos del usuario a incluir en el token
 * @returns Token JWT firmado
 * 
 * ¿Qué hace?
 * - Toma los datos del usuario (id, email, rol)
 * - Los firma con el JWT_SECRET
 * - Retorna un token que expira en 7 días (configurable)
 */
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
};

/**
 * Verifica y decodifica un token JWT
 * 
 * @param token - Token JWT a verificar
 * @returns Payload decodificado o null si es inválido
 * 
 * ¿Qué hace?
 * - Verifica que el token esté firmado correctamente
 * - Verifica que no haya expirado
 * - Retorna los datos del usuario si es válido
 * - Retorna null si es inválido o expirado
 */
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        // Token inválido, expirado o mal formado
        return null;
    }
};

/**
 * Extrae el token del header Authorization
 * 
 * @param authHeader - Header "Authorization: Bearer <token>"
 * @returns Token sin el prefijo "Bearer " o null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader) {
        return null;
    }

    // Formato: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
};

