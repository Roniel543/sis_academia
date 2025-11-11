# 📚 Contexto del Proyecto - Sistema Académico

## 🎯 Descripción General

Sistema de gestión académica completo desarrollado con **React + TypeScript** (Frontend) y **Node.js + Express + TypeScript** (Backend), conectado a **PostgreSQL**.

---

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico:**

**Frontend:**
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- Tailwind CSS 3.4.18
- Lucide React (iconos)

**Backend:**
- Node.js
- Express 4.21.1
- TypeScript 5.6.3
- Prisma 5.22.0 (ORM)
- PostgreSQL (Base de datos)

**Comunicación:**
- REST API (JSON)
- CORS configurado

---

## 📁 Estructura del Proyecto

```
app-react-colegio/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── auth/                 # Login
│   │   ├── common/               # Header, Modal, NavigationTabs, StatCard
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── usuarios/             # CRUD de usuarios
│   │   ├── estudiantes/          # CRUD de estudiantes
│   │   ├── cursos/               # CRUD de cursos
│   │   ├── matricula/            # CRUD de matrículas
│   │   ├── asistencia/           # Registro de asistencia QR
│   │   ├── carnet/               # Carnets digitales
│   │   └── examenes/             # CRUD de exámenes
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexto de autenticación JWT
│   ├── hooks/                    # Hooks personalizados conectados con API
│   │   ├── useUsuarios.ts
│   │   ├── useEstudiantes.ts
│   │   ├── useCursos.ts
│   │   ├── useMatriculas.ts
│   │   ├── useAsistencia.ts
│   │   ├── useExamenes.ts
│   │   ├── useDashboard.ts
│   │   └── useAppData.ts
│   ├── services/
│   │   └── api.ts                # Servicio API centralizado con JWT
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript
│   ├── validations/              # Esquemas Zod para validación
│   ├── utils/
│   │   └── mappers.ts            # Utilidades de mapeo
│   ├── App.tsx                   # Componente principal
│   └── main.tsx                  # Punto de entrada
│
├── backend/                      # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio (todos los módulos)
│   │   │   ├── auth.controller.ts
│   │   │   ├── usuarios.controller.ts
│   │   │   ├── estudiantes.controller.ts
│   │   │   ├── profesores.controller.ts
│   │   │   ├── cursos.controller.ts
│   │   │   ├── matriculas.controller.ts
│   │   │   ├── asistencia.controller.ts
│   │   │   ├── examenes.controller.ts
│   │   │   ├── carnets.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── routes/               # Rutas de la API (todos los módulos)
│   │   │   ├── auth.routes.ts
│   │   │   ├── usuarios.routes.ts
│   │   │   ├── estudiantes.routes.ts
│   │   │   ├── profesores.routes.ts
│   │   │   ├── cursos.routes.ts
│   │   │   ├── matriculas.routes.ts
│   │   │   ├── asistencia.routes.ts
│   │   │   ├── examenes.routes.ts
│   │   │   ├── carnets.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── middleware/          # Middlewares de seguridad
│   │   │   ├── auth.middleware.ts    # JWT authentication
│   │   │   ├── validation.middleware.ts  # Validación Zod
│   │   │   └── logger.ts             # Logging de requests
│   │   ├── utils/
│   │   │   ├── prisma.ts         # Cliente Prisma singleton
│   │   │   ├── jwt.ts            # Utilidades JWT
│   │   │   └── password.ts       # Hash de contraseñas (bcrypt)
│   │   ├── validations/
│   │   │   └── schemas.ts        # Esquemas Zod para validación
│   │   └── index.ts              # Servidor Express
│   ├── prisma/
│   │   ├── schema.prisma         # Esquema de base de datos
│   │   ├── migrations/           # Migraciones ejecutadas
│   │   └── seed.ts               # Script de seed (crea admin inicial)
│   ├── .env                      # Variables de entorno (NO subir a Git)
│   └── package.json
│
└── sistema_academico.sql         # Esquema SQL original (MySQL, ya convertido a Prisma)
```

---

## ✅ Estado Actual del Proyecto

### **Frontend (React):**

#### ✅ **Completado:**
- ✅ Sistema de autenticación con JWT
  - Login funcional conectado con backend
  - Sesión persistente (localStorage con token JWT)
  - Logout funcional
  - Header dinámico con usuario real
  - Manejo de token expirado
- ✅ Dashboard con estadísticas (conectado con backend)
- ✅ CRUD completo de Usuarios (conectado con backend)
- ✅ CRUD completo de Estudiantes (conectado con backend)
- ✅ CRUD completo de Cursos (conectado con backend)
- ✅ CRUD completo de Matrículas (conectado con backend)
- ✅ Registro de Asistencia con QR Scanner (funcional)
  - Escáner QR con cámara de PC
  - Registro automático al escanear
- ✅ Gestión de Carnets (conectado con backend)
  - Crear, editar, eliminar carnets
  - Generación automática de código QR
  - Vista previa e impresión
- ✅ CRUD completo de Exámenes (conectado con backend)
- ✅ Diseño responsive con Tailwind CSS
- ✅ Navegación por pestañas
- ✅ Validaciones con react-hook-form + Zod
- ✅ Servicio API centralizado (`src/services/api.ts`)
- ✅ Hooks personalizados para cada módulo (useUsuarios, useEstudiantes, useCursos, useMatriculas, useAsistencia, useExamenes, useDashboard)
- ✅ Validación de formularios con react-hook-form + Zod
- ✅ Manejo de errores y estados de carga

#### ⚠️ **Pendiente:**
- ⚠️ Control de acceso por roles en frontend (backend sí tiene)
  - Todos los usuarios ven las mismas pestañas
  - No hay vistas diferenciadas por rol
  - No hay filtrado de datos por rol

---

### **Backend (Node.js/Express):**

#### ✅ **Completado:**
- ✅ Servidor Express configurado
- ✅ Prisma configurado para PostgreSQL
- ✅ Schema de base de datos convertido a Prisma
- ✅ Cliente Prisma generado
- ✅ Migraciones ejecutadas (tablas creadas en PostgreSQL)
- ✅ Seed script para crear admin inicial
- ✅ Estructura de rutas y controladores
- ✅ Middleware de autenticación JWT
- ✅ Middleware de autorización por roles
- ✅ Validación con Zod
- ✅ Hash de contraseñas con bcrypt
- ✅ Logging de requests
- ✅ **Endpoints implementados (COMPLETOS):**
  - ✅ `POST /api/auth/login` - Autenticación con JWT
  - ✅ `GET /api/auth/me` - Obtener usuario autenticado (requiere token)
  - ✅ `GET /api/usuarios` - Listar usuarios
  - ✅ `GET /api/usuarios/:id` - Obtener usuario
  - ✅ `POST /api/usuarios` - Crear usuario (con hash de contraseña)
  - ✅ `PUT /api/usuarios/:id` - Actualizar usuario
  - ✅ `DELETE /api/usuarios/:id` - Eliminar usuario (solo admin)
  - ✅ `GET /api/estudiantes` - CRUD completo de estudiantes
  - ✅ `GET /api/profesores` - CRUD completo de profesores
  - ✅ `GET /api/cursos` - CRUD completo de cursos
  - ✅ `GET /api/matriculas` - CRUD completo de matrículas
  - ✅ `GET /api/asistencia` - CRUD completo de asistencia
  - ✅ `GET /api/examenes` - CRUD completo de exámenes
  - ✅ `GET /api/examenes/:id/resultados` - Resultados de exámenes
  - ✅ `GET /api/carnets` - CRUD completo de carnets
  - ✅ `GET /api/dashboard/stats` - Estadísticas del dashboard

#### ⚠️ **Pendiente:**
- ⚠️ Nada crítico - Todos los endpoints principales están implementados

---

### **Base de Datos (PostgreSQL):**

#### ✅ **Completado:**
- ✅ Schema Prisma creado y validado
- ✅ Cliente Prisma generado
- ✅ Conexión configurada
- ✅ Migraciones ejecutadas (todas las tablas creadas)
- ✅ Seed script ejecutado (admin creado)
- ✅ Base de datos funcional y lista para usar

---

## 🔐 Autenticación Actual

### **Usuario de Prueba:**
- **Email:** `admin-vexler@gmail.com`
- **Contraseña:** `admin123`
- **Rol:** `administrador`
- **Estado:** Creado en base de datos con contraseña hasheada

### **Funcionamiento:**
1. Frontend tiene login en `src/components/auth/Login.tsx`
2. Backend valida credenciales en `POST /api/auth/login`
3. Backend genera token JWT y lo retorna
4. Frontend guarda token en localStorage
5. Token se envía en header `Authorization: Bearer <token>` en cada request
6. Backend valida token con middleware `authenticate`
7. Sin login, no se puede acceder al dashboard

### **Seguridad Implementada:**
- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT tokens con expiración (7 días por defecto)
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ Middleware de autorización por roles (`requireRole`)
- ✅ Validación de datos con Zod

---

## 📊 Modelos de Datos (Prisma Schema)

### **Entidades Principales:**

1. **Usuario** - Usuarios del sistema (estudiante, profesor, administrador)
2. **Estudiante** - Información específica de estudiantes
3. **Profesor** - Información específica de profesores
4. **Curso** - Catálogo de cursos
5. **Matricula** - Relación estudiantes-cursos
6. **Asistencia** - Registro de asistencia con códigos QR
7. **Examen** - Exámenes y simulacros
8. **ResultadoExamen** - Resultados de exámenes
9. **Carnet** - Carnets digitales con QR

### **Relaciones:**
- `Usuario` → `Estudiante` / `Profesor` (1:1)
- `Estudiante` → `Matricula` (1:N)
- `Curso` → `Matricula` (1:N)
- `Matricula` → `Asistencia` (1:N)
- `Curso` → `Examen` (1:N)
- `Examen` → `ResultadoExamen` (1:N)
- `Matricula` → `ResultadoExamen` (1:N)

---

## 🚀 Cómo Ejecutar el Proyecto

### **Backend:**

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Configurar .env (ver CONFIGURAR_ENV.md)
# DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sistema_academico"

# 3. Generar cliente Prisma
npm run prisma:generate

# 4. (Opcional) Crear tablas en BD
npm run prisma:migrate

# 5. Iniciar servidor
npm run dev
```

**Servidor corre en:** `http://localhost:3000`

---

### **Frontend:**

```bash
# Desde la raíz del proyecto

# 1. Instalar dependencias
npm install

# 2. Configurar .env (ver CONFIGURAR_ENV.md)
# VITE_API_URL="http://localhost:3000"

# 3. Iniciar servidor de desarrollo
npm run dev
```

**Frontend corre en:** `http://localhost:5173`

---

## 🔌 Endpoints de la API Disponibles

### **Base URL:** `http://localhost:3000`

### **Autenticación:**
- `POST /api/auth/login` - Iniciar sesión (retorna JWT token)
- `GET /api/auth/me` - Obtener información del usuario autenticado (requiere token)

### **Usuarios:**
- `GET /api/usuarios` - Listar todos (requiere auth)
- `GET /api/usuarios/:id` - Obtener uno (requiere auth)
- `POST /api/usuarios` - Crear (requiere auth, hash automático de contraseña)
- `PUT /api/usuarios/:id` - Actualizar (requiere auth)
- `DELETE /api/usuarios/:id` - Eliminar (requiere rol admin)

### **Estudiantes:**
- `GET /api/estudiantes` - Listar todos (requiere auth)
- `GET /api/estudiantes/:id` - Obtener uno (requiere auth)
- `POST /api/estudiantes` - Crear (requiere auth)
- `PUT /api/estudiantes/:id` - Actualizar (requiere auth)
- `DELETE /api/estudiantes/:id` - Eliminar (requiere rol admin)

### **Profesores:**
- `GET /api/profesores` - Listar todos (requiere auth)
- `GET /api/profesores/:id` - Obtener uno (requiere auth)
- `POST /api/profesores` - Crear (requiere auth)
- `PUT /api/profesores/:id` - Actualizar (requiere auth)
- `DELETE /api/profesores/:id` - Eliminar (requiere rol admin)

### **Cursos:**
- `GET /api/cursos` - Listar todos (requiere auth)
- `GET /api/cursos/:id` - Obtener uno (requiere auth)
- `POST /api/cursos` - Crear (requiere auth)
- `PUT /api/cursos/:id` - Actualizar (requiere auth)
- `DELETE /api/cursos/:id` - Eliminar (requiere rol admin)

### **Matrículas:**
- `GET /api/matriculas` - Listar todas (requiere auth)
- `GET /api/matriculas/:id` - Obtener una (requiere auth)
- `POST /api/matriculas` - Crear (requiere auth)
- `PUT /api/matriculas/:id` - Actualizar (requiere auth)
- `DELETE /api/matriculas/:id` - Eliminar (requiere rol admin)

### **Asistencia:**
- `GET /api/asistencia` - Listar todas (requiere auth)
- `GET /api/asistencia/:id` - Obtener una (requiere auth)
- `POST /api/asistencia` - Crear (requiere auth)
- `PUT /api/asistencia/:id` - Actualizar (requiere auth)
- `DELETE /api/asistencia/:id` - Eliminar (requiere rol admin)

### **Exámenes:**
- `GET /api/examenes` - Listar todos (requiere auth)
- `GET /api/examenes/:id` - Obtener uno (requiere auth)
- `POST /api/examenes` - Crear (requiere auth)
- `PUT /api/examenes/:id` - Actualizar (requiere auth)
- `DELETE /api/examenes/:id` - Eliminar (requiere rol admin)
- `GET /api/examenes/:id/resultados` - Obtener resultados (requiere auth)
- `POST /api/examenes/:id/resultados` - Crear/actualizar resultado (requiere auth)

### **Carnets:**
- `GET /api/carnets` - Listar todos (requiere auth, filtros: estado, usuario_id, codigo, codigo_qr)
- `GET /api/carnets/:id` - Obtener uno (requiere auth)
- `POST /api/carnets` - Crear (requiere auth, genera QR automático)
- `PUT /api/carnets/:id` - Actualizar (requiere auth)
- `DELETE /api/carnets/:id` - Eliminar (requiere rol admin)

### **Dashboard:**
- `GET /api/dashboard/stats` - Estadísticas (requiere auth)

---

## 📝 Variables de Entorno

### **Backend (`backend/.env`):**
```env
PORT=3000
DATABASE_URL="postgresql://postgres:contraseña@localhost:5432/sistema_academico"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="sistema_academico_secret_key_2024"
NODE_ENV="development"
```

### **Frontend (`.env` en raíz):**
```env
VITE_API_URL="http://localhost:3000"
VITE_NODE_ENV="development"
```

---

## 🎯 Próximos Pasos Sugeridos

### **Prioridad Alta:**
1. ⚠️ Control de acceso por roles en frontend:
   - Ocultar botones según rol del usuario
   - Filtrar datos según rol (profesores solo ven sus cursos, estudiantes solo sus datos)
   - Crear vistas diferenciadas por rol

### **Prioridad Media:**
2. ⚠️ Mejoras de UX:
   - Loading states mejorados
   - Manejo de errores más robusto
   - Confirmaciones antes de eliminar

3. ⚠️ Funcionalidades adicionales:
   - Reportes y estadísticas avanzadas
   - Exportación de datos
   - Notificaciones

### **Prioridad Baja:**
4. ⚠️ Optimizaciones:
   - Paginación en listas grandes
   - Búsqueda avanzada
   - Filtros múltiples

---

## 🐛 Problemas Conocidos

1. **Control de acceso en frontend** - Todos los usuarios ven las mismas pestañas y botones (el backend sí protege)
2. **Filtrado de datos** - No se filtra según rol del usuario (profesores ven todos los estudiantes, no solo los de sus cursos)
3. **Vistas diferenciadas** - No hay dashboards diferentes para profesor/estudiante

---

## 📚 Archivos de Documentación

- `README.md` - Documentación general del proyecto
- `TODO_BACKEND.md` - Lista de tareas del backend
- `TODO_AUTENTICACION_BASICO.md` - Tareas de autenticación
- `CONFIGURAR_ENV.md` - Guía de configuración de variables de entorno
- `backend/README.md` - Documentación del backend
- `backend/COMO_PROBAR_ENDPOINTS.md` - Guía para probar endpoints
- `backend/SETUP_POSTGRESQL.md` - Guía de instalación de PostgreSQL

---

## 🔄 Flujo de Datos Actual

```
Frontend (React)
    ↓
Servicio API (src/services/api.ts) - Maneja JWT tokens
    ↓
Hooks personalizados (useUsuarios, useEstudiantes, etc.)
    ↓
Backend API (Express) - Valida JWT, autoriza por roles
    ↓
Prisma ORM
    ↓
PostgreSQL
```

**Estado:** ✅ Frontend completamente conectado con backend. Todos los módulos funcionan con datos reales.

---

## 👥 Roles del Sistema

### **Administrador:**
- Acceso completo
- Gestión de usuarios
- Gestión de matrículas
- Ver todas las asistencias
- Gestión de exámenes
- Generar carnets

### **Profesor:** (Pendiente implementar)
- Ver sus cursos asignados
- Registrar asistencia
- Crear/editar exámenes de sus cursos
- Ver resultados de exámenes

### **Estudiante:** (Pendiente implementar)
- Ver sus matrículas
- Ver su asistencia
- Ver sus exámenes y resultados
- Ver/descargar su carnet

---

## 🛠️ Comandos Útiles

### **Backend:**
```bash
npm run dev              # Desarrollo con hot reload
npm run build            # Compilar TypeScript
npm run start            # Producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (GUI)
```

### **Frontend:**
```bash
npm run dev              # Desarrollo
npm run build            # Compilar para producción
npm run preview          # Preview de producción
```

---

## 📞 Información de Contacto/Colaboración

Este documento sirve como contexto para continuar el desarrollo del proyecto. Cualquier cambio importante debe actualiz
arse aquí.

**Última actualización:** Enero 2025

---

## 🎓 Notas para el Desarrollo

- ✅ El proyecto está en desarrollo activo y funcional
- ✅ La base de datos está completamente configurada con Prisma y migraciones ejecutadas
- ✅ El frontend está completamente conectado con el backend (NO usa datos mock)
- ✅ Todos los endpoints CRUD están implementados y funcionando
- ✅ La autenticación JWT está completamente implementada con hash de contraseñas (bcrypt)
- ✅ Middleware de autenticación y autorización por roles funcionando
- ✅ Validación de datos con Zod en frontend y backend
- ⚠️ Pendiente: Control de acceso por roles en frontend (backend sí tiene protección)
- ⚠️ Pendiente: Filtrado de datos según rol del usuario en frontend

**Estado general:** ✅ Sistema funcional y completo. Frontend y backend completamente conectados. Todos los endpoints CRUD implementados y probados. Autenticación JWT con hash de contraseñas funcionando. Base de datos operativa con Prisma. Middleware de seguridad implementado. ⚠️ Pendiente: Control de acceso por roles en frontend y filtrado de datos según rol.

