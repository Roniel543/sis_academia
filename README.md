# Sistema Académico - React + TypeScript

Sistema de gestión académica completo desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard**: Vista general con estadísticas del sistema
- **Gestión de Usuarios**: CRUD completo para estudiantes, profesores y administradores
- **Matrículas**: Gestión de matrículas por semestre y curso
- **Asistencia QR**: Registro de asistencia mediante códigos QR
- **Carnets Digitales**: Generación y visualización de carnets estudiantiles
- **Exámenes**: Gestión de exámenes, simulacros y resultados

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── NavigationTabs.tsx
│   │   └── StatCard.tsx
│   ├── dashboard/       # Componentes del dashboard
│   │   └── Dashboard.tsx
│   ├── usuarios/       # Gestión de usuarios
│   │   ├── UsuariosTab.tsx
│   │   └── UsuarioForm.tsx
│   ├── matricula/      # Gestión de matrículas
│   │   ├── MatriculaTab.tsx
│   │   └── MatriculaForm.tsx
│   ├── asistencia/     # Registro de asistencia
│   │   ├── AsistenciaTab.tsx
│   │   └── AsistenciaForm.tsx
│   ├── carnet/         # Generación de carnets
│   │   └── CarnetTab.tsx
│   └── examenes/       # Gestión de exámenes
│       ├── ExamenesTab.tsx
│       └── ExamenForm.tsx
├── hooks/
│   └── useAppData.ts   # Hook personalizado para manejo de datos
├── types/
│   └── index.ts        # Definiciones de tipos TypeScript
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada

```

## 🛠️ Tecnologías

- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 🎨 Características de Diseño

- Diseño responsive y moderno
- Interfaz intuitiva con navegación por pestañas
- Modales para formularios
- Tablas con búsqueda y filtros
- Tarjetas de estadísticas visuales
- Iconos consistentes en toda la aplicación

## 📝 Tipos de Datos

El sistema maneja las siguientes entidades:

- **Usuario**: Estudiantes, profesores y administradores
- **Matrícula**: Registro de matrículas por curso y semestre
- **Asistencia**: Registro de asistencia con códigos QR
- **Examen**: Gestión de exámenes y simulacros
- **Carnet**: Carnets digitales con códigos QR

## 🔧 Configuración

### Variables de Entorno

Actualmente el sistema utiliza datos mock. Para conectar con un backend:

1. Crear archivo `.env`
2. Agregar variables de configuración de API
3. Actualizar `useAppData.ts` para usar llamadas a API

### Base de Datos

El proyecto incluye un archivo SQL (`sistema_academico.sql`) con el esquema de base de datos MySQL para el sistema académico.

## 📚 Próximos Pasos

- [ ] Integración con API backend
- [ ] Autenticación y autorización
- [ ] Escaneo real de códigos QR
- [ ] Generación de PDFs para carnets
- [ ] Reportes y estadísticas avanzadas
- [ ] Notificaciones en tiempo real

## 👥 Desarrollo

Este proyecto fue desarrollado siguiendo las mejores prácticas de React y TypeScript:

- Componentes funcionales con hooks
- Separación de responsabilidades
- Tipado fuerte con TypeScript
- Código escalable y mantenible
- Estructura modular

## 📄 Licencia

Este proyecto es de uso académico.
