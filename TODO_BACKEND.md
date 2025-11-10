# 📋 TODO List - Backend API (Node.js + Express + TypeScript)

## 🎯 Stack Tecnológico Recomendado

### **Backend: Node.js + Express + TypeScript**
**¿Por qué esta opción?**
- ✅ Mismo lenguaje que el frontend (TypeScript)
- ✅ Muy popular y ampliamente usado
- ✅ Excelente para APIs REST
- ✅ Fácil de mantener y escalar
- ✅ Muchas librerías disponibles
- ✅ Comunidad grande y soporte

### **Stack Completo:**
```
Frontend:  React + TypeScript + Vite (ya tenemos)
Backend:   Node.js + Express + TypeScript
Base de Datos: PostgreSQL
Comunicación: REST API (JSON)
ORM: Prisma (facilita queries a la BD)
```

---

## 📝 Tareas para Implementar Backend

### 🔧 **BACKEND-1: Configurar Proyecto Backend**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 20-30 min

**Descripción:**
- Crear carpeta `backend/` en la raíz del proyecto
- Inicializar proyecto Node.js con TypeScript
- Instalar dependencias: Express, TypeScript, Prisma, MySQL2
- Configurar estructura de carpetas básica

**Archivos a crear:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env` (variables de entorno)
- Estructura de carpetas

**Dependencias principales:**
- `express` - Framework web
- `typescript` - TypeScript
- `@prisma/client` - ORM para PostgreSQL
- `prisma` - CLI de Prisma
- `cors` - Para permitir peticiones del frontend
- `dotenv` - Variables de entorno
- `bcryptjs` - Para hashear contraseñas
- `jsonwebtoken` - Para tokens JWT (opcional, para auth avanzada)

---

### 🗄️ **BACKEND-2: Configurar Prisma con PostgreSQL**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- Configurar Prisma para conectar con PostgreSQL
- Crear `schema.prisma` basado en el SQL existente
- Configurar conexión a base de datos
- Generar cliente de Prisma

**Archivos a crear:**
- `backend/prisma/schema.prisma`
- `backend/.env` (con DATABASE_URL)

**Pasos:**
1. Convertir el esquema SQL a Prisma Schema (compatible con PostgreSQL)
2. Configurar conexión a PostgreSQL (puerto 5432)
3. Crear base de datos: `CREATE DATABASE sistema_academico;`
4. Ejecutar migraciones

---

### 🛣️ **BACKEND-3: Crear Estructura de Rutas (API)**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30-40 min

**Descripción:**
- Crear estructura de rutas REST API
- Endpoints principales:
  - `/api/auth` - Autenticación
  - `/api/usuarios` - CRUD de usuarios
  - `/api/matriculas` - CRUD de matrículas
  - `/api/asistencia` - CRUD de asistencia
  - `/api/examenes` - CRUD de exámenes
  - `/api/dashboard` - Estadísticas del dashboard

**Archivos a crear:**
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/usuarios.routes.ts`
- `backend/src/routes/matriculas.routes.ts`
- `backend/src/routes/asistencia.routes.ts`
- `backend/src/routes/examenes.routes.ts`
- `backend/src/routes/dashboard.routes.ts`
- `backend/src/index.ts` (servidor principal)

---

### 🔐 **BACKEND-4: Implementar Autenticación**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Endpoint POST `/api/auth/login`
- Validar credenciales contra BD
- Retornar usuario (sin contraseña)
- Opcional: Implementar JWT para tokens

**Archivos a crear:**
- `backend/src/controllers/auth.controller.ts`
- `backend/src/middleware/auth.middleware.ts` (opcional)

---

### 👥 **BACKEND-5: Implementar CRUD de Usuarios**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- GET `/api/usuarios` - Listar todos
- GET `/api/usuarios/:id` - Obtener uno
- POST `/api/usuarios` - Crear
- PUT `/api/usuarios/:id` - Actualizar
- DELETE `/api/usuarios/:id` - Eliminar

**Archivos a crear:**
- `backend/src/controllers/usuarios.controller.ts`

---

### 📚 **BACKEND-6: Implementar CRUD de Matrículas**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Endpoints CRUD completos para matrículas
- Relaciones con estudiantes y cursos

**Archivos a crear:**
- `backend/src/controllers/matriculas.controller.ts`

---

### ✅ **BACKEND-7: Implementar CRUD de Asistencia**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- Endpoints para registrar y consultar asistencia
- Relación con matrículas

**Archivos a crear:**
- `backend/src/controllers/asistencia.controller.ts`

---

### 📝 **BACKEND-8: Implementar CRUD de Exámenes**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Endpoints CRUD para exámenes
- Relación con cursos

**Archivos a crear:**
- `backend/src/controllers/examenes.controller.ts`

---

### 📊 **BACKEND-9: Implementar Endpoint de Dashboard**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- GET `/api/dashboard/stats`
- Calcular estadísticas desde BD:
  - Total estudiantes
  - Total profesores
  - Matrículas activas
  - Tasa de asistencia
  - Exámenes programados/completados

**Archivos a crear:**
- `backend/src/controllers/dashboard.controller.ts`

---

### 🔌 **BACKEND-10: Conectar Frontend con Backend**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 60-90 min

**Descripción:**
- Crear servicio/cliente API en el frontend
- Reemplazar datos mock por llamadas reales a la API
- Actualizar `useAppData` para usar fetch/axios
- Manejar errores y loading states

**Archivos a crear/modificar:**
- `src/services/api.ts` (cliente API)
- Modificar `src/hooks/useAppData.ts`
- `src/utils/constants.ts` (URL del backend)

---

## 🔄 Orden de Implementación Recomendado

### Fase 1: Configuración Base
1. ✅ BACKEND-1: Configurar proyecto
2. ✅ BACKEND-2: Configurar Prisma + MySQL

### Fase 2: API Básica
3. ✅ BACKEND-3: Estructura de rutas
4. ✅ BACKEND-4: Autenticación
5. ✅ BACKEND-9: Dashboard stats (para probar conexión)

### Fase 3: CRUDs Completos
6. ✅ BACKEND-5: Usuarios
7. ✅ BACKEND-6: Matrículas
8. ✅ BACKEND-7: Asistencia
9. ✅ BACKEND-8: Exámenes

### Fase 4: Integración Frontend
10. ✅ BACKEND-10: Conectar frontend con backend

---

## 📦 Estructura de Carpetas Propuesta

```
sis_academia/
├── src/                    # Frontend (ya existe)
├── backend/                 # Backend (nuevo)
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middlewares (auth, etc)
│   │   ├── utils/           # Utilidades
│   │   └── index.ts         # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de BD
│   ├── .env                 # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
└── sistema_academico.sql    # Esquema SQL (ya existe)
```

---

## 🌐 Comunicación API (REST)

### Ejemplo de Endpoints:

```
POST   /api/auth/login          # Login
GET    /api/usuarios             # Listar usuarios
POST   /api/usuarios             # Crear usuario
PUT    /api/usuarios/:id         # Actualizar usuario
DELETE /api/usuarios/:id         # Eliminar usuario
GET    /api/dashboard/stats      # Estadísticas
```

### Formato de Respuesta:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

---

## 🚀 ¿Empezamos?

Voy a crear el backend paso a paso. ¿Procedo con la Fase 1?

