import bcrypt from 'bcryptjs';

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promise<string> - Contraseña hasheada
 * 
 * AQUI TOMAMOS LA CONTRASEÑA EN TEXTO PLANO Y LA HASHEAMOS
 * - Toma la contraseña en texto plano (ej: "admin123")
 * - Genera un "salt" (valor aleatorio para mayor seguridad)
 * - Hashea la contraseña con el salt
 * - Retorna un string hasheado (ej: "$2a$10$N9qo8uLOickgx2ZMRZoMye...")
 * 
 * ¿Por qué es seguro?
 * - El mismo password genera diferentes hashes cada vez (gracias al salt)
 * - Es irreversible (no se puede obtener el password original del hash)
 * - Es lento intencionalmente (previene ataques de fuerza bruta)
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Número de rondas de hashing (más alto = más seguro pero más lento)
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña en texto plano con un hash
 * @param password - Contraseña en texto plano
 * @param hash - Contraseña hasheada almacenada en la BD
 * @returns Promise<boolean> - true si coinciden, false si no
 * 
 * AQUI COMPARAMOS LA CONTRASEÑA EN TEXTO PLANO CON EL HASH ALMACENADO EN LA BD
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

