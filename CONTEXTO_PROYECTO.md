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
sis_academia/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── auth/                 # Login
│   │   ├── common/               # Header, Modal, NavigationTabs, StatCard
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── usuarios/             # CRUD de usuarios
│   │   ├── matricula/            # CRUD de matrículas
│   │   ├── asistencia/           # Registro de asistencia QR
│   │   ├── carnet/               # Carnets digitales
│   │   └── examenes/             # CRUD de exámenes
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexto de autenticación
│   ├── hooks/
│   │   └── useAppData.ts         # Hook con datos MOCK (pendiente conectar con API)
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript
│   ├── data/
│   │   └── mockUsers.ts          # Usuario admin de prueba
│   ├── App.tsx                   # Componente principal
│   └── main.tsx                  # Punto de entrada
│
├── backend/                      # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── auth.controller.ts
│   │   │   ├── usuarios.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── routes/               # Rutas de la API
│   │   │   ├── auth.routes.ts
│   │   │   ├── usuarios.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── utils/
│   │   │   └── prisma.ts         # Cliente Prisma singleton
│   │   └── index.ts              # Servidor Express
│   ├── prisma/
│   │   └── schema.prisma         # Esquema de base de datos
│   ├── .env                      # Variables de entorno (NO subir a Git)
│   └── package.json
│
└── sistema_academico.sql         # Esquema SQL original (MySQL, ya convertido a Prisma)
```

---

## ✅ Estado Actual del Proyecto

### **Frontend (React):**

#### ✅ **Completado:**
- ✅ Sistema de autenticación básico (solo admin)
  - Login funcional
  - Sesión persistente (localStorage)
  - Logout funcional
  - Header dinámico con usuario real
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de Usuarios
- ✅ CRUD completo de Matrículas
- ✅ Registro de Asistencia (simulado)
- ✅ Visualización de Carnets
- ✅ CRUD completo de Exámenes
- ✅ Diseño responsive con Tailwind CSS
- ✅ Navegación por pestañas

#### ⚠️ **Pendiente:**
- ⚠️ **Datos MOCK**: Actualmente usa datos hardcodeados en `useAppData.ts`
- ⚠️ **Conectar con Backend**: Reemplazar datos mock por llamadas reales a la API
- ⚠️ Control de acceso por roles (profesor/estudiante) - Solo admin implementado

---

### **Backend (Node.js/Express):**

#### ✅ **Completado:**
- ✅ Servidor Express configurado
- ✅ Prisma configurado para PostgreSQL
- ✅ Schema de base de datos convertido a Prisma
- ✅ Cliente Prisma generado
- ✅ Estructura de rutas y controladores
- ✅ **Endpoints implementados:**
  - ✅ `POST /api/auth/login` - Autenticación
  - ✅ `GET /api/usuarios` - Listar usuarios
  - ✅ `GET /api/usuarios/:id` - Obtener usuario
  - ✅ `POST /api/usuarios` - Crear usuario
  - ✅ `PUT /api/usuarios/:id` - Actualizar usuario
  - ✅ `DELETE /api/usuarios/:id` - Eliminar usuario
  - ✅ `GET /api/dashboard/stats` - Estadísticas del dashboard

#### ⚠️ **Pendiente:**
- ⚠️ Endpoints de Matrículas
- ⚠️ Endpoints de Asistencia
- ⚠️ Endpoints de Exámenes
- ⚠️ Endpoints de Cursos
- ⚠️ Endpoints de Resultados de Exámenes
- ⚠️ Endpoints de Carnets
- ⚠️ Hash de contraseñas (actualmente se comparan en texto plano)
- ⚠️ JWT tokens (opcional, para auth avanzada)

---

### **Base de Datos (PostgreSQL):**

#### ✅ **Completado:**
- ✅ Schema Prisma creado y validado
- ✅ Cliente Prisma generado
- ✅ Conexión configurada

#### ⚠️ **Pendiente:**
- ⚠️ Ejecutar migraciones para crear las tablas en PostgreSQL
- ⚠️ Insertar datos iniciales (seed)

---

## 🔐 Autenticación Actual

### **Usuario de Prueba:**
- **Email:** `admin-vexler@gmail.com`
- **Contraseña:** `admin123`
- **Rol:** `administrador`

### **Funcionamiento:**
1. Frontend tiene login en `src/components/auth/Login.tsx`
2. Backend valida credenciales en `POST /api/auth/login`
3. Sesión se guarda en localStorage del navegador
4. Sin login, no se puede acceder al dashboard

### **Nota de Seguridad:**
- ⚠️ Las contraseñas NO están hasheadas (se comparan en texto plano)
- ⚠️ No hay JWT tokens (solo sesión en localStorage)
- ⚠️ Pendiente implementar bcrypt para hash de contraseñas

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
- `POST /api/auth/login` - Iniciar sesión

### **Usuarios:**
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Obtener uno
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/:id` - Actualizar
- `DELETE /api/usuarios/:id` - Eliminar

### **Dashboard:**
- `GET /api/dashboard/stats` - Estadísticas

### **Pendientes:**
- `/api/matriculas/*` - CRUD de matrículas
- `/api/asistencia/*` - CRUD de asistencia
- `/api/examenes/*` - CRUD de exámenes
- `/api/cursos/*` - CRUD de cursos

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
1. ✅ Conectar Frontend con Backend
   - Crear servicio API en frontend
   - Reemplazar datos mock en `useAppData.ts`
   - Manejar estados de loading y error

2. ⚠️ Implementar endpoints faltantes:
   - Matrículas
   - Asistencia
   - Exámenes
   - Cursos

3. ⚠️ Hash de contraseñas:
   - Implementar bcrypt en backend
   - Actualizar login para comparar hashes

### **Prioridad Media:**
4. ⚠️ Control de acceso por roles:
   - Vistas diferentes para profesor/estudiante
   - Filtrado de datos según rol

5. ⚠️ Migraciones de base de datos:
   - Crear tablas en PostgreSQL
   - Seed de datos iniciales

### **Prioridad Baja:**
6. ⚠️ JWT tokens (opcional)
7. ⚠️ Validación de datos más robusta
8. ⚠️ Manejo de errores mejorado

---

## 🐛 Problemas Conocidos

1. **Contraseñas en texto plano** - No están hasheadas
2. **Datos mock en frontend** - No conectado con backend aún
3. **Sin validación de roles** - Cualquiera puede acceder si tiene login
4. **Sin migraciones ejecutadas** - Las tablas pueden no existir en PostgreSQL

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
useAppData (datos MOCK) ← ⚠️ Pendiente conectar
    ↓
Backend API (Express)
    ↓
Prisma ORM
    ↓
PostgreSQL
```

**Estado:** Frontend usa datos mock, backend está listo para recibir peticiones.

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

- El proyecto está en desarrollo activo
- La base de datos está diseñada pero puede necesitar migraciones
- El frontend está funcional pero usa datos mock
- El backend tiene endpoints básicos implementados
- La autenticación funciona pero es básica (sin hash de contraseñas)

**Estado general:** ✅ Funcional para desarrollo, ⚠️ Pendiente conectar frontend-backend y completar endpoints faltantes.

