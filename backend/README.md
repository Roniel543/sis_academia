# Backend - Sistema Académico

Backend API desarrollado con Node.js + Express + TypeScript + Prisma + PostgreSQL

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/` y configura:
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sistema_academico_vexler"

# Servidor
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL="http://localhost:5173"

# JWT (si se implementa autenticación con tokens)
JWT_SECRET="tu_secreto_jwt_aqui"

# Usuario Admin (opcional - para seed)
# Si no se definen, se usarán los valores por defecto
ADMIN_EMAIL="admin-vexler@gmail.com"
ADMIN_PASSWORD="admin123"
ADMIN_NOMBRE="admin-vexler"
```

**Nota:** Las variables `ADMIN_*` son opcionales. Si no las defines, el seed usará los valores por defecto. Es recomendable cambiarlas en producción.

**Nota:** Asegúrate de tener PostgreSQL instalado y corriendo. Crea la base de datos:
```sql
CREATE DATABASE sistema_academico;
```

### 3. Configurar Prisma
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Si la BD ya existe, solo generar el cliente
# Si necesitas crear las tablas desde Prisma:
npm run prisma:migrate
```

### 4. Iniciar servidor
```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Rutas de la API
│   ├── middleware/      # Middlewares (auth, etc)
│   ├── utils/          # Utilidades
│   └── index.ts        # Servidor principal
├── prisma/
│   └── schema.prisma   # Esquema de base de datos
├── .env                 # Variables de entorno
└── package.json
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Generar cliente Prisma
npm run prisma:generate

# Abrir Prisma Studio (GUI para BD)
npm run prisma:studio

# Compilar TypeScript
npm run build
```

## 📝 Notas

- El servidor corre en `http://localhost:3000` por defecto
- Health check: `http://localhost:3000/api/health`
- Asegúrate de que PostgreSQL esté corriendo antes de iniciar
- Puerto por defecto de PostgreSQL: `5432`

