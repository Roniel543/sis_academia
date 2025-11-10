import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import usuariosRoutes from './routes/usuarios.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: 'API del Sistema Académico',
        version: '1.0.0',
        status: 'running'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// TODO: Agregar más rutas cuando estén listas
// app.use('/api/matriculas', matriculasRoutes);
// app.use('/api/asistencia', asistenciaRoutes);
// app.use('/api/examenes', examenesRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`👥 Usuarios: http://localhost:${PORT}/api/usuarios`);
    console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
});

