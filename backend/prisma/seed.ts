import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de base de datos...');

    // Usar variables de entorno con valores por defecto
    const adminEmail = process.env.ADMIN_EMAIL || 'admin-vexler@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminNombre = process.env.ADMIN_NOMBRE || 'admin-vexler';

    // Verificar si ya existe el usuario admin
    const adminExists = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (adminExists) {
        console.log(' Usuario admin ya existe. No se requiere acción.');
        return;
    }

    // El usuario no existe, crearlo con contraseña hasheada
    console.log('📝 Creando nuevo usuario admin...');
    const contrasenaHasheada = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.usuario.create({
        data: {
            nombre_completo: adminNombre,
            email: adminEmail,
            contrasena: contrasenaHasheada, // Contraseña hasheada con bcrypt
            rol: 'administrador',
            estado: 'activo',
        },
        select: {
            id: true,
            email: true,
            nombre_completo: true,
            rol: true,
        },
    });

    console.log(' Usuario admin creado exitosamente:', {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre_completo,
        rol: admin.rol,
    });

    console.log(' Seed completado exitosamente!');
}

main()
    .catch((e) => {
        console.error(' Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

