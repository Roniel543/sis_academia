# 🔐 Permisos y Capacidades por Rol

## 📋 Resumen Ejecutivo

**Estado Actual:** El sistema tiene **control de acceso en el backend**, pero **NO en el frontend**. Esto significa que:

- ✅ **Backend**: Protege endpoints según rol (solo admin puede eliminar)
- ❌ **Frontend**: Todos los usuarios (admin, profesor, estudiante) ven las mismas pestañas y datos

---

## 👨‍💼 ADMINISTRADOR

### ✅ **Lo que PUEDE hacer:**

#### **En el Backend (API):**
- ✅ **Usuarios:**
  - Ver todos los usuarios (GET)
  - Crear usuarios (POST)
  - Actualizar usuarios (PUT)
  - **Eliminar usuarios (DELETE)** ← Solo admin

- ✅ **Estudiantes:**
  - Ver todos los estudiantes (GET)
  - Crear estudiantes (POST)
  - Actualizar estudiantes (PUT)
  - **Eliminar estudiantes (DELETE)** ← Solo admin

- ✅ **Profesores:**
  - Ver todos los profesores (GET)
  - Crear profesores (POST)
  - Actualizar profesores (PUT)
  - **Eliminar profesores (DELETE)** ← Solo admin

- ✅ **Cursos:**
  - Ver todos los cursos (GET)
  - Crear cursos (POST)
  - Actualizar cursos (PUT)
  - **Eliminar cursos (DELETE)** ← Solo admin

- ✅ **Matrículas:**
  - Ver todas las matrículas (GET)
  - Crear matrículas (POST)
  - Actualizar matrículas (PUT)
  - **Eliminar matrículas (DELETE)** ← Solo admin

- ✅ **Asistencia:**
  - Ver todas las asistencias (GET)
  - Crear asistencias (POST)
  - Actualizar asistencias (PUT)
  - **Eliminar asistencias (DELETE)** ← Solo admin

- ✅ **Exámenes:**
  - Ver todos los exámenes (GET)
  - Crear exámenes (POST)
  - Actualizar exámenes (PUT)
  - **Eliminar exámenes (DELETE)** ← Solo admin

- ✅ **Carnets:**
  - Ver todos los carnets (GET)
  - Crear carnets (POST)
  - Actualizar carnets (PUT)
  - **Eliminar carnets (DELETE)** ← Solo admin

- ✅ **Dashboard:**
  - Ver estadísticas completas (GET)

#### **En el Frontend:**
- ✅ Ver todas las pestañas:
  - Dashboard
  - Usuarios
  - Estudiantes
  - Cursos
  - Matrícula
  - Asistencia QR
  - Carnet
  - Exámenes

- ✅ Ver todos los datos (sin filtros)
- ✅ Crear, editar y eliminar todo
- ✅ Usar escáner QR para asistencia
- ✅ Generar carnets

---

## 👨‍🏫 PROFESOR

### ✅ **Lo que PUEDE hacer:**

#### **En el Backend (API):**
- ✅ **Usuarios:**
  - Ver todos los usuarios (GET)
  - Crear usuarios (POST)
  - Actualizar usuarios (PUT)
  - ❌ **NO puede eliminar usuarios**

- ✅ **Estudiantes:**
  - Ver todos los estudiantes (GET)
  - Crear estudiantes (POST)
  - Actualizar estudiantes (PUT)
  - ❌ **NO puede eliminar estudiantes**

- ✅ **Profesores:**
  - Ver todos los profesores (GET)
  - Crear profesores (POST)
  - Actualizar profesores (PUT)
  - ❌ **NO puede eliminar profesores**

- ✅ **Cursos:**
  - Ver todos los cursos (GET)
  - Crear cursos (POST)
  - Actualizar cursos (PUT)
  - ❌ **NO puede eliminar cursos**

- ✅ **Matrículas:**
  - Ver todas las matrículas (GET)
  - Crear matrículas (POST)
  - Actualizar matrículas (PUT)
  - ❌ **NO puede eliminar matrículas**

- ✅ **Asistencia:**
  - Ver todas las asistencias (GET)
  - Crear asistencias (POST) ← **Puede registrar asistencia**
  - Actualizar asistencias (PUT)
  - ❌ **NO puede eliminar asistencias**

- ✅ **Exámenes:**
  - Ver todos los exámenes (GET)
  - Crear exámenes (POST) ← **Puede crear exámenes**
  - Actualizar exámenes (PUT) ← **Puede editar exámenes**
  - ❌ **NO puede eliminar exámenes**

- ✅ **Carnets:**
  - Ver todos los carnets (GET)
  - Crear carnets (POST)
  - Actualizar carnets (PUT)
  - ❌ **NO puede eliminar carnets**

- ✅ **Dashboard:**
  - Ver estadísticas completas (GET)

#### **En el Frontend:**
- ⚠️ **Actualmente ve TODO** (igual que admin):
  - Dashboard
  - Usuarios
  - Estudiantes
  - Cursos
  - Matrícula
  - Asistencia QR
  - Carnet
  - Exámenes

- ⚠️ **Puede intentar eliminar** (pero el backend lo rechazará con error 403)

- ✅ Puede usar escáner QR para registrar asistencia
- ✅ Puede crear y editar exámenes

---

## 👨‍🎓 ESTUDIANTE

### ✅ **Lo que PUEDE hacer:**

#### **En el Backend (API):**
- ✅ **Usuarios:**
  - Ver todos los usuarios (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Estudiantes:**
  - Ver todos los estudiantes (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Cursos:**
  - Ver todos los cursos (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Matrículas:**
  - Ver todas las matrículas (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Asistencia:**
  - Ver todas las asistencias (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Exámenes:**
  - Ver todos los exámenes (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Carnets:**
  - Ver todos los carnets (GET)
  - ❌ NO puede crear, actualizar ni eliminar

- ✅ **Dashboard:**
  - Ver estadísticas completas (GET)

#### **En el Frontend:**
- ⚠️ **Actualmente ve TODO** (igual que admin):
  - Dashboard
  - Usuarios
  - Estudiantes
  - Cursos
  - Matrícula
  - Asistencia QR
  - Carnet
  - Exámenes

- ⚠️ **Puede intentar crear/editar/eliminar** (pero el backend lo rechazará con error 403 o 401)

---

## 🔒 Protecciones Actuales

### **Backend (Funcionando):**

| Acción | Admin | Profesor | Estudiante |
|--------|-------|----------|------------|
| **Ver datos** | ✅ Todo | ✅ Todo | ✅ Todo |
| **Crear** | ✅ Todo | ✅ Todo | ❌ Nada |
| **Editar** | ✅ Todo | ✅ Todo | ❌ Nada |
| **Eliminar** | ✅ Todo | ❌ Nada | ❌ Nada |

**Nota:** El backend valida el rol antes de permitir DELETE, pero no valida CREATE/UPDATE por rol (solo requiere autenticación).

### **Frontend (NO Funcionando):**

| Acción | Admin | Profesor | Estudiante |
|--------|-------|----------|------------|
| **Ver pestañas** | ✅ Todas | ✅ Todas | ✅ Todas |
| **Ver datos** | ✅ Todos | ✅ Todos | ✅ Todos |
| **Botones crear/editar** | ✅ Visibles | ✅ Visibles | ✅ Visibles |
| **Botones eliminar** | ✅ Visibles | ✅ Visibles | ✅ Visibles |

**Problema:** Todos ven los mismos botones, aunque el backend los rechace.

---

## ⚠️ Problemas Actuales

### 1. **Frontend no oculta acciones según rol**
- Profesores y estudiantes ven botones de "Eliminar" que no pueden usar
- Esto genera confusión y errores 403

### 2. **No hay filtrado de datos**
- Profesores ven TODOS los estudiantes (deberían ver solo los de sus cursos)
- Estudiantes ven TODOS los datos (deberían ver solo los suyos)

### 3. **No hay vistas diferenciadas**
- Todos ven el mismo dashboard
- No hay dashboard específico para profesores o estudiantes

---

## 🎯 Lo que DEBERÍA hacer cada rol

### **ADMINISTRADOR** (Como está ahora - Correcto)
- ✅ Acceso completo a todo
- ✅ Puede gestionar usuarios, estudiantes, profesores
- ✅ Puede crear cursos y matrículas
- ✅ Puede registrar asistencia
- ✅ Puede crear exámenes
- ✅ Puede generar carnets
- ✅ Puede eliminar cualquier registro

### **PROFESOR** (Debería poder)
- ✅ Ver solo sus cursos asignados
- ✅ Ver estudiantes de sus cursos
- ✅ Registrar asistencia de sus estudiantes
- ✅ Crear y editar exámenes de sus cursos
- ✅ Ver resultados de exámenes de sus cursos
- ❌ NO puede gestionar usuarios
- ❌ NO puede crear cursos
- ❌ NO puede eliminar registros

### **ESTUDIANTE** (Debería poder)
- ✅ Ver solo sus matrículas
- ✅ Ver solo su asistencia
- ✅ Ver solo sus exámenes y resultados
- ✅ Ver/descargar su carnet
- ❌ NO puede crear, editar ni eliminar nada
- ❌ NO puede ver datos de otros estudiantes

---

## 📝 Resumen para el Usuario

**Actualmente:**
- ✅ **Admin**: Puede hacer TODO (correcto)
- ⚠️ **Profesor**: Ve todo, puede crear/editar, pero NO puede eliminar
- ⚠️ **Estudiante**: Ve todo, pero NO puede crear/editar/eliminar (el backend lo bloquea)

**Problema principal:**
- El frontend no diferencia entre roles
- Todos ven las mismas pestañas y botones
- El backend sí protege, pero la UX es confusa

**Recomendación:**
- Implementar ocultamiento de botones según rol en frontend
- Filtrar datos según rol
- Crear vistas diferenciadas

