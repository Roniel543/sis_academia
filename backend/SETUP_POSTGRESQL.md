# 🐘 Configuración de PostgreSQL

## Instalación de PostgreSQL

### Windows
1. Descargar desde: https://www.postgresql.org/download/windows/
2. Instalar con el instalador gráfico
3. Durante la instalación, configurar:
   - Usuario: `postgres` (por defecto)
   - Contraseña: (la que elijas, guárdala)
   - Puerto: `5432` (por defecto)

### Verificar instalación
```bash
# Verificar que PostgreSQL está corriendo
psql --version

# O desde pgAdmin (interfaz gráfica que viene con la instalación)
```

## Crear Base de Datos

### Opción 1: Desde línea de comandos (psql)
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE sistema_academico;

# Verificar que se creó
\l

# Salir
\q
```

### Opción 2: Desde pgAdmin (GUI)
1. Abrir pgAdmin
2. Conectarse al servidor local
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `sistema_academico`
5. Click "Save"

## Configurar .env

En `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sistema_academico"
```

**Formato de DATABASE_URL:**
```
postgresql://usuario:contraseña@host:puerto/nombre_bd
```

## Ejecutar Migraciones

Una vez configurado el `.env`:

```bash
cd backend

# Generar cliente de Prisma
npm run prisma:generate

# Crear las tablas en la base de datos
npm run prisma:migrate

# O si prefieres usar Prisma Studio para ver la BD
npm run prisma:studio
```

## Verificar Conexión

```bash
# Iniciar el servidor
npm run dev

# Deberías ver:
# 🚀 Servidor corriendo en http://localhost:3000
```

Si hay errores de conexión, verifica:
- ✅ PostgreSQL está corriendo
- ✅ La base de datos `sistema_academico` existe
- ✅ El usuario y contraseña en `.env` son correctos
- ✅ El puerto es `5432` (o el que configuraste)

## Comandos Útiles de PostgreSQL

```sql
-- Conectarse a la base de datos
\c sistema_academico

-- Ver todas las tablas
\dt

-- Ver estructura de una tabla
\d nombre_tabla

-- Salir
\q
```

