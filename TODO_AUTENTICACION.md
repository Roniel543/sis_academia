# 📋 TODO List - Sistema de Autenticación y Control de Acceso

## 🎯 Objetivo General
Implementar un sistema completo de autenticación con control de acceso por roles (Administrador, Profesor, Estudiante) para el Sistema Académico.

---

## 📝 Tareas Detalladas

### 🔐 **AUTH-1: Crear Contexto de Autenticación (AuthContext)**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- Crear un Context de React que maneje el estado global de autenticación
- Funcionalidades:
  - Estado del usuario actual (usuario logueado o null)
  - Función `login(email, password)` - valida credenciales y establece sesión
  - Función `logout()` - cierra sesión y limpia estado
  - Función `isAuthenticated()` - verifica si hay usuario logueado
  - Persistencia en localStorage para mantener sesión

**Archivos a crear:**
- `src/contexts/AuthContext.tsx`

**Dependencias:**
- Ninguna (es la base del sistema)

---

### 🔑 **AUTH-2: Crear Componente Login**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Crear página/formulario de login
- Campos: Email y Contraseña
- Validación de campos (email válido, contraseña requerida)
- Manejo de errores (credenciales incorrectas)
- Diseño moderno y responsive con Tailwind
- Integración con AuthContext para hacer login

**Archivos a crear:**
- `src/components/auth/Login.tsx`
- `src/pages/LoginPage.tsx` (opcional, si usamos routing)

**Dependencias:**
- AUTH-1 (necesita AuthContext)

---

### 🛡️ **AUTH-3: Implementar Rutas Protegidas**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- Crear componente `ProtectedRoute` que:
  - Verifica si el usuario está autenticado
  - Si NO está autenticado → redirige a `/login`
  - Si SÍ está autenticado → muestra el contenido protegido
- Envolver las rutas principales de la app con este componente

**Archivos a crear:**
- `src/components/auth/ProtectedRoute.tsx`
- Modificar `src/App.tsx` para usar rutas protegidas

**Dependencias:**
- AUTH-1 (necesita AuthContext)

---

### 🪝 **AUTH-4: Crear Hook useAuth**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 15-20 min

**Descripción:**
- Crear hook personalizado que simplifique el acceso al AuthContext
- Evita tener que usar `useContext(AuthContext)` en cada componente
- Proporciona: `user`, `login`, `logout`, `isAuthenticated`

**Archivos a crear:**
- `src/hooks/useAuth.ts`

**Dependencias:**
- AUTH-1 (necesita AuthContext)

---

### 👤 **AUTH-5: Actualizar Header con Usuario Real**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 20-30 min

**Descripción:**
- Modificar `Header.tsx` para:
  - Mostrar el nombre del usuario logueado (no hardcodeado)
  - Mostrar el rol del usuario
  - Agregar botón de logout
  - Mostrar avatar/icono según el rol

**Archivos a modificar:**
- `src/components/common/Header.tsx`

**Dependencias:**
- AUTH-4 (usa useAuth hook)

---

### 🔒 **AUTH-6: Implementar Control de Acceso por Roles**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Crear componente `RoleGuard` que:
  - Verifica si el usuario tiene el rol necesario
  - Si NO tiene el rol → muestra mensaje de "Acceso denegado" o redirige
  - Si SÍ tiene el rol → muestra el contenido
- Definir permisos por rol:
  - **Admin:** Acceso completo a todo
  - **Profesor:** Solo sus cursos, asistencia, exámenes de sus cursos
  - **Estudiante:** Solo ver sus propios datos

**Archivos a crear:**
- `src/components/auth/RoleGuard.tsx`
- `src/utils/permissions.ts` (definir permisos)

**Dependencias:**
- AUTH-4 (usa useAuth hook)

---

### 🎨 **AUTH-7: Crear Vistas Diferenciadas por Rol**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 60-90 min

**Descripción:**
- Crear diferentes dashboards según el rol:
  - **Dashboard Admin:** Todas las estadísticas y gestión completa
  - **Dashboard Profesor:** Sus cursos, asistencia de sus estudiantes, exámenes
  - **Dashboard Estudiante:** Sus matrículas, su asistencia, sus exámenes, su carnet
- Modificar navegación para mostrar solo las pestañas permitidas según rol

**Archivos a crear/modificar:**
- `src/components/dashboard/DashboardAdmin.tsx`
- `src/components/dashboard/DashboardProfesor.tsx`
- `src/components/dashboard/DashboardEstudiante.tsx`
- Modificar `src/App.tsx` para mostrar dashboard según rol

**Dependencias:**
- AUTH-6 (necesita RoleGuard)

---

### 📊 **AUTH-8: Actualizar useAppData para Filtrar por Usuario**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45-60 min

**Descripción:**
- Modificar `useAppData` para:
  - Recibir el usuario actual como parámetro
  - Filtrar datos según el rol:
    - **Admin:** Ve todos los datos
    - **Profesor:** Solo ve datos de sus cursos
    - **Estudiante:** Solo ve sus propios datos
- Mantener la funcionalidad CRUD pero con restricciones según rol

**Archivos a modificar:**
- `src/hooks/useAppData.ts`

**Dependencias:**
- AUTH-4 (necesita useAuth para obtener usuario)

---

### 👥 **AUTH-9: Agregar Datos Mock con Contraseñas**
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 20-30 min

**Descripción:**
- Crear usuarios de prueba con contraseñas:
  - Admin: admin@academia.edu / password123
  - Profesor: profesor@academia.edu / password123
  - Estudiante: estudiante@academia.edu / password123
- Almacenar en un archivo de constantes o en el AuthContext
- Usar para validación en el login

**Archivos a crear/modificar:**
- `src/data/mockUsers.ts` (opcional)
- O agregar directamente en AuthContext

**Dependencias:**
- AUTH-1 (necesita AuthContext)

---

### 💾 **AUTH-10: Implementar Persistencia de Sesión**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 30-45 min

**Descripción:**
- Guardar información de sesión en localStorage:
  - Token o ID de usuario
  - Información básica del usuario
- Al cargar la app, verificar si hay sesión guardada
- Restaurar sesión automáticamente si existe
- Limpiar localStorage al hacer logout

**Archivos a modificar:**
- `src/contexts/AuthContext.tsx`

**Dependencias:**
- AUTH-1 (se implementa junto con AuthContext)

---

## 🔄 Orden de Implementación Recomendado

### Fase 1: Base de Autenticación (Fundamental)
1. ✅ AUTH-1: Crear AuthContext
2. ✅ AUTH-9: Agregar datos mock con contraseñas
3. ✅ AUTH-2: Crear componente Login
4. ✅ AUTH-3: Implementar rutas protegidas
5. ✅ AUTH-10: Persistencia de sesión (se puede hacer junto con AUTH-1)

### Fase 2: Mejoras de UX
6. ✅ AUTH-4: Crear hook useAuth
7. ✅ AUTH-5: Actualizar Header

### Fase 3: Control de Acceso
8. ✅ AUTH-6: Control de acceso por roles
9. ✅ AUTH-8: Filtrar datos por usuario
10. ✅ AUTH-7: Vistas diferenciadas por rol

---

## 📦 Estructura de Archivos Propuesta

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── components/
│   ├── auth/
│   │   ├── Login.tsx             # Componente de login
│   │   ├── ProtectedRoute.tsx   # Ruta protegida
│   │   └── RoleGuard.tsx         # Guard de roles
│   └── dashboard/
│       ├── DashboardAdmin.tsx
│       ├── DashboardProfesor.tsx
│       └── DashboardEstudiante.tsx
├── hooks/
│   ├── useAuth.ts                # Hook de autenticación
│   └── useAppData.ts             # (modificar)
├── utils/
│   └── permissions.ts            # Definición de permisos
└── data/
    └── mockUsers.ts              # Usuarios de prueba (opcional)
```

---

## 🎯 Resultado Final Esperado

Al completar todas las tareas, el sistema tendrá:

✅ Login funcional con validación  
✅ Sesión persistente (no se pierde al recargar)  
✅ Control de acceso por roles  
✅ Vistas diferentes según el rol del usuario  
✅ Protección de rutas  
✅ Datos filtrados según permisos  
✅ Logout funcional  
✅ Header dinámico con usuario real  

---

## 🚀 ¿Empezamos?

¿Quieres que comience con la **Fase 1** (Base de Autenticación)? 
Empezaré creando el AuthContext y el sistema de login.

