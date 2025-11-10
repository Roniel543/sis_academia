# 🔧 Configuración de Variables de Entorno

## 📋 Resumen

El proyecto tiene **DOS archivos `.env` separados**:
1. **Backend** (`backend/.env`) - Para el servidor Node.js/Express
2. **Frontend** (`/.env`) - Para la aplicación React

---

## 🎯 Backend - Configurar `.env`

### Ubicación: `backend/.env`

1. **Copia el archivo de ejemplo:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edita `backend/.env` y configura:**

   ```env
   # Puerto del servidor
   PORT=3000

   # PostgreSQL - IMPORTANTE: Cambia TU_CONTRASEÑA
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sistema_academico"

   # URL del frontend (para CORS)
   FRONTEND_URL="http://localhost:5173"

   # JWT Secret (cambiar en producción)
   JWT_SECRET="sistema_academico_secret_key_2024"

   # Entorno
   NODE_ENV="development"
   ```



## 🎨 Frontend - Configurar `.env`

### Ubicación: `/.env` (raíz del proyecto)

1. **Copia el archivo de ejemplo:**
   ```bash
   # Desde la raíz del proyecto
   cp .env.example .env
   ```

2. **Edita `.env` y configura:**

   ```env
   # URL del Backend API
   VITE_API_URL="http://localhost:3000"

   # Entorno
   VITE_NODE_ENV="development"
   ```

### ⚠️ Importante:
- En Vite, las variables de entorno deben empezar con `VITE_`
- Si cambias el puerto del backend, actualiza `VITE_API_URL`

---

## ✅ Verificar Configuració

### Backend:
```bash
cd backend
npm run dev
# Debería conectarse a PostgreSQL sin errores
```

### Frontend:
```bash
# Desde la raíz del proyecto
npm run dev
# Debería poder hacer peticiones al backend
```

---



## 📝 Ejemplo de Valores

### Backend `.env`:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:mipassword123@localhost:5432/sistema_academico"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="mi_secreto_super_seguro_12345"
NODE_ENV="development"
```

### Frontend `.env`:
```env
VITE_API_URL="http://localhost:3000"
VITE_NODE_ENV="development"
```

---

## 🚨 Troubleshooting

### Error: "Cannot find module" o variables undefined
- Verifica que el archivo se llame exactamente `.env` (con el punto)
- Reinicia el servidor después de cambiar `.env`
- En Vite, las variables deben empezar con `VITE_`

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Verifica usuario, contraseña y puerto en `DATABASE_URL`
- Verifica que la base de datos `sistema_academico` exista

### Error de CORS en el frontend
- Verifica que `FRONTEND_URL` en backend coincida con la URL del frontend
- Verifica que `VITE_API_URL` en frontend apunte al backend correcto

