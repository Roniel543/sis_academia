# 🧪 Cómo Probar los Endpoints de la API

## 📋 Opciones para Probar Endpoints

Tienes **3 opciones** para probar los endpoints:

1. **Postman** (Aplicación de escritorio - Recomendada)
2. **Thunder Client** (Extensión de VS Code - Más fácil)
3. **Navegador/curl** (Solo para GET)

---

## 🚀 Opción 1: Thunder Client (Más Fácil - Recomendada)

**Thunder Client** es una extensión de VS Code, perfecta para probar APIs sin salir del editor.

### Instalación:
1. Abre VS Code
2. Ve a Extensiones (Ctrl+Shift+X)
3. Busca "Thunder Client"
4. Instala la extensión

### Usar Thunder Client:
1. Abre el panel de Thunder Client (icono de rayo en la barra lateral)
2. Crea una nueva petición
3. Selecciona el método (GET, POST, etc.)
4. Ingresa la URL
5. Click en "Send"

---

## 📮 Opción 2: Postman (Aplicación Completa)

### Instalación:
1. Descarga desde: https://www.postman.com/downloads/
2. Instala la aplicación
3. Crea una cuenta (gratis)

### Usar Postman:
1. Abre Postman
2. Click en "New" → "HTTP Request"
3. Selecciona el método (GET, POST, PUT, DELETE)
4. Ingresa la URL
5. Para POST/PUT: Ve a "Body" → "raw" → "JSON"
6. Click en "Send"

---

## 🌐 Opción 3: Navegador (Solo GET)

Solo funciona para peticiones GET. Abre directamente en el navegador:
- `http://localhost:3000/api/usuarios`
- `http://localhost:3000/api/dashboard/stats`

---

## 📝 Ejemplos de Pruebas

### ✅ 1. Health Check (GET)
**Método:** GET  
**URL:** `http://localhost:3000/api/health`  
**Body:** Ninguno

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

### ✅ 2. Login (POST)
**Método:** POST  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:** 
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin-vexler@gmail.com",
  "password": "admin123"
}
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre_completo": "admin-vexler",
    "email": "admin-vexler@gmail.com",
    "rol": "administrador",
    "estado": "activo"
  },
  "message": "Login exitoso"
}
```

---

### ✅ 3. Listar Usuarios (GET)
**Método:** GET  
**URL:** `http://localhost:3000/api/usuarios`  
**Body:** Ninguno

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre_completo": "admin-vexler",
      "email": "admin-vexler@gmail.com",
      "rol": "administrador",
      "estado": "activo"
    }
  ],
  "count": 1
}
```

---

### ✅ 4. Obtener Usuario por ID (GET)
**Método:** GET  
**URL:** `http://localhost:3000/api/usuarios/1`  
**Body:** Ninguno

---

### ✅ 5. Crear Usuario (POST)
**Método:** POST  
**URL:** `http://localhost:3000/api/usuarios`  
**Headers:** 
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre_completo": "Juan Pérez",
  "email": "juan@academia.edu",
  "contrasena": "password123",
  "rol": "estudiante",
  "estado": "activo"
}
```

---

### ✅ 6. Actualizar Usuario (PUT)
**Método:** PUT  
**URL:** `http://localhost:3000/api/usuarios/1`  
**Headers:** 
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre_completo": "Admin Vexler Actualizado",
  "estado": "activo"
}
```

---

### ✅ 7. Eliminar Usuario (DELETE)
**Método:** DELETE  
**URL:** `http://localhost:3000/api/usuarios/1`  
**Body:** Ninguno

---

### ✅ 8. Dashboard Stats (GET)
**Método:** GET  
**URL:** `http://localhost:3000/api/dashboard/stats`  
**Body:** Ninguno

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 0,
    "totalTeachers": 0,
    "activeEnrollments": 0,
    "attendanceRate": 0,
    "examsScheduled": 0,
    "examsCompleted": 0
  }
}
```

---

## 🔧 Antes de Probar

### 1. Asegúrate de que el servidor esté corriendo:
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
```

### 2. Verifica que PostgreSQL esté corriendo y conectado

### 3. Si hay errores de TypeScript:
```bash
cd backend
npm run prisma:generate
npm run build
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Reinicia el servidor
- Ejecuta: `npm run prisma:generate`
- Verifica que los archivos existan en `backend/src/controllers/`

### Error: "Connection refused"
- Verifica que el servidor esté corriendo en el puerto 3000
- Verifica que no haya otro proceso usando el puerto

### Error: "Database connection"
- Verifica que PostgreSQL esté corriendo
- Verifica el `DATABASE_URL` en `backend/.env`
- Verifica que la base de datos `sistema_academico` exista

---

## 💡 Tip: Colección de Postman

Puedes crear una colección en Postman con todos estos endpoints para tenerlos organizados y guardados.

---

## 🎯 Recomendación

**Para empezar rápido:** Usa **Thunder Client** (extensión de VS Code)  
**Para uso profesional:** Usa **Postman**

