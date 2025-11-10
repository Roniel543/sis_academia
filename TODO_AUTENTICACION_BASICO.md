# 📋 TODO List - Autenticación Básica (Solo Admin)

## 🎯 Objetivo
Implementar autenticación básica **SOLO para administrador**. El sistema funcionará igual que ahora, pero con login/logout. Sin control de roles por ahora.

---

## 📝 Tareas Simplificadas

### 🔐 **AUTH-BASIC-1: Crear AuthContext Básico**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 20-30 min

**Descripción:**
- Crear Context simple que maneje:
  - Estado: `user` (usuario logueado o `null`)
  - Función `login(email, password)` - valida y guarda usuario
  - Función `logout()` - limpia usuario
  - Guardar en localStorage para persistencia
  - Restaurar sesión al cargar la app

**Archivos a crear:**
- `src/contexts/AuthContext.tsx`

**Lo que hace:**
- Si hay usuario → está logueado
- Si no hay usuario → no está logueado
- Simple y directo, sin roles por ahora

---

### 👤 **AUTH-BASIC-2: Crear Datos Mock de Admin**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 10 min

**Descripción:**
- Crear un solo usuario admin de prueba:
  - Email: `admin@academia.edu`
  - Contraseña: `admin123`
  - Rol: `administrador`
  - Nombre: `Administrador`

**Archivos a crear:**
- `src/data/mockUsers.ts` (o directamente en AuthContext)

**Uso:**
- Se usa para validar credenciales en el login

---

### 🔑 **AUTH-BASIC-3: Crear Componente Login**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30-40 min

**Descripción:**
- Formulario simple con:
  - Campo Email
  - Campo Contraseña
  - Botón "Iniciar Sesión"
  - Validación básica (campos requeridos)
  - Mensaje de error si credenciales incorrectas
  - Diseño limpio con Tailwind

**Archivos a crear:**
- `src/components/auth/Login.tsx`

**Funcionalidad:**
- Al enviar, llama a `login()` del AuthContext
- Si es correcto → redirige al dashboard
- Si es incorrecto → muestra error

---

### 🏠 **AUTH-BASIC-4: Modificar App.tsx**
**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 15-20 min

**Descripción:**
- Modificar `App.tsx` para:
  - Si NO hay usuario logueado → mostrar `<Login />`
  - Si SÍ hay usuario logueado → mostrar el Dashboard normal (como está ahora)

**Archivos a modificar:**
- `src/App.tsx`

**Lógica:**
```tsx
{!user ? <Login /> : <DashboardCompleto />}
```

---

### 👋 **AUTH-BASIC-5: Actualizar Header**
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 15-20 min

**Descripción:**
- Modificar Header para:
  - Mostrar nombre del admin logueado (no hardcodeado)
  - Agregar botón "Cerrar Sesión"
  - Al hacer logout, limpiar sesión y volver a login

**Archivos a modificar:**
- `src/components/common/Header.tsx`

---

## 🔄 Orden de Implementación

1. ✅ **AUTH-BASIC-1**: AuthContext básico
2. ✅ **AUTH-BASIC-2**: Datos mock de admin
3. ✅ **AUTH-BASIC-3**: Componente Login
4. ✅ **AUTH-BASIC-4**: Modificar App.tsx
5. ✅ **AUTH-BASIC-5**: Actualizar Header

**Tiempo total estimado:** ~90-120 minutos

---

## 📦 Estructura de Archivos (Simplificada)

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto básico de auth
├── components/
│   └── auth/
│       └── Login.tsx             # Componente de login
├── data/
│   └── mockUsers.ts              # Usuario admin de prueba
└── App.tsx                       # (modificar)
```

---

## 🎯 Resultado Final (Fase Básica)

Al completar estas tareas:

✅ Login funcional (solo admin)  
✅ Sesión persistente (localStorage)  
✅ Logout funcional  
✅ Header con usuario real  
✅ Protección básica (sin login no entra)  

**Lo que NO tendremos aún:**
- ❌ Control de roles (profesor/estudiante)
- ❌ Vistas diferenciadas por rol
- ❌ Filtrado de datos por rol
- ❌ Rutas protegidas complejas

**Eso será para Fase 2 o 3** 🚀

---

## 🚀 ¿Empezamos?

Voy a implementar las 5 tareas básicas. ¿Procedo?

