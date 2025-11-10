// Servicio API para comunicarse con el backend
import type { Usuario, EstadisticasDashboard } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    message: string;
    statusCode?: number;
    originalError?: unknown;
}

export const createApiError = (
    message: string,
    statusCode?: number,
    originalError?: unknown
): ApiError => ({
    message,
    statusCode,
    originalError,
});

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = API_URL;
        // Cargar token del localStorage al inicializar
        this.loadToken();
    }

    /**
     * Carga el token del localStorage
     */
    private loadToken(): void {
        const storedToken = localStorage.getItem('sis_academia_token');
        if (storedToken) {
            this.token = storedToken;
        }
    }

    /**
     * Guarda el token en localStorage y en memoria
     */
    setToken(token: string | null): void {
        this.token = token;
        if (token) {
            localStorage.setItem('sis_academia_token', token);
        } else {
            localStorage.removeItem('sis_academia_token');
        }
    }

    /**
     * Obtiene el token actual
     */
    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            // SIEMPRE cargar token del localStorage antes de cada request (por si cambió)
            // Esto asegura que si el token se guardó después de que se instanció el servicio,
            // se cargue correctamente
            const storedToken = localStorage.getItem('sis_academia_token');
            if (storedToken) {
                this.token = storedToken;
            } else if (!this.token) {
                // Si no hay token en localStorage ni en memoria, intentar cargar
                this.loadToken();
            }

            // Preparar headers con token si existe
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string> || {}),
            };

            // Agregar token JWT si está disponible (excepto para login)
            if (this.token && !endpoint.includes('/auth/login')) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers,
                ...options,
            });

            // Manejar respuestas que no son JSON
            let data: any;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = text ? { message: text } : {};
            }

            // Si el token expiró o es inválido (401), limpiar token
            if (response.status === 401) {
                this.setToken(null);
                // Disparar evento para que AuthContext haga logout
                window.dispatchEvent(new CustomEvent('auth:token-expired'));
            }

            if (!response.ok) {
                const errorMessage = data.message || data.error || `Error ${response.status}: ${response.statusText}`;
                throw createApiError(errorMessage, response.status, data);
            }

            return {
                success: true,
                data: data.data !== undefined ? data.data : data,
                message: data.message,
            };
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                const apiError = error as ApiError;
                return {
                    success: false,
                    error: apiError.message,
                };
            }

            // Errores de red o conexión
            console.error('Error en petición API:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    // Autenticación
    async login(email: string, password: string) {
        return this.request<{ user: Usuario; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    /**
     * GET /api/auth/me
     * Obtiene la información del usuario autenticado
     */
    async getMe() {
        return this.request<Usuario>('/api/auth/me');
    }

    // Usuarios
    async getUsuarios() {
        return this.request<Usuario[]>('/api/usuarios');
    }

    async getUsuario(id: number) {
        return this.request<Usuario>(`/api/usuarios/${id}`);
    }

    async createUsuario(usuario: Omit<Usuario, 'id' | 'fecha_registro' | 'ultima_conexion'>) {
        return this.request<Usuario>('/api/usuarios', {
            method: 'POST',
            body: JSON.stringify(usuario),
        });
    }

    async updateUsuario(id: number, usuario: Partial<Omit<Usuario, 'id'>>) {
        return this.request<Usuario>(`/api/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(usuario),
        });
    }

    async deleteUsuario(id: number) {
        return this.request(`/api/usuarios/${id}`, {
            method: 'DELETE',
        });
    }

    // Estudiantes
    async getEstudiantes() {
        return this.request<any[]>('/api/estudiantes');
    }

    async getEstudiante(id: number) {
        return this.request<any>(`/api/estudiantes/${id}`);
    }

    async createEstudiante(estudiante: any) {
        return this.request<any>('/api/estudiantes', {
            method: 'POST',
            body: JSON.stringify(estudiante),
        });
    }

    async updateEstudiante(id: number, estudiante: any) {
        return this.request<any>(`/api/estudiantes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(estudiante),
        });
    }

    async deleteEstudiante(id: number) {
        return this.request(`/api/estudiantes/${id}`, {
            method: 'DELETE',
        });
    }

    // Cursos
    async getCursos() {
        return this.request<any[]>('/api/cursos');
    }

    async getCurso(id: number) {
        return this.request<any>(`/api/cursos/${id}`);
    }

    async createCurso(curso: any) {
        return this.request<any>('/api/cursos', {
            method: 'POST',
            body: JSON.stringify(curso),
        });
    }

    async updateCurso(id: number, curso: any) {
        return this.request<any>(`/api/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(curso),
        });
    }

    async deleteCurso(id: number) {
        return this.request(`/api/cursos/${id}`, {
            method: 'DELETE',
        });
    }

    // Dashboard
    async getDashboardStats() {
        return this.request<EstadisticasDashboard>('/api/dashboard/stats');
    }

    // Matrículas
    async getMatriculas() {
        return this.request<any[]>('/api/matriculas');
    }

    async getMatricula(id: number) {
        return this.request<any>(`/api/matriculas/${id}`);
    }

    async createMatricula(matricula: any) {
        return this.request<any>('/api/matriculas', {
            method: 'POST',
            body: JSON.stringify(matricula),
        });
    }

    async updateMatricula(id: number, matricula: any) {
        return this.request<any>(`/api/matriculas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(matricula),
        });
    }

    async deleteMatricula(id: number) {
        return this.request(`/api/matriculas/${id}`, {
            method: 'DELETE',
        });
    }

    // Asistencia
    async getAsistencias(filters?: { matricula_id?: number; fecha?: string; estado?: string }) {
        const queryParams = new URLSearchParams();
        if (filters?.matricula_id) queryParams.append('matricula_id', filters.matricula_id.toString());
        if (filters?.fecha) queryParams.append('fecha', filters.fecha);
        if (filters?.estado) queryParams.append('estado', filters.estado);
        
        const query = queryParams.toString();
        return this.request<any[]>(`/api/asistencia${query ? `?${query}` : ''}`);
    }

    async getAsistencia(id: number) {
        return this.request<any>(`/api/asistencia/${id}`);
    }

    async createAsistencia(asistencia: any) {
        return this.request<any>('/api/asistencia', {
            method: 'POST',
            body: JSON.stringify(asistencia),
        });
    }

    async updateAsistencia(id: number, asistencia: any) {
        return this.request<any>(`/api/asistencia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(asistencia),
        });
    }

    async deleteAsistencia(id: number) {
        return this.request(`/api/asistencia/${id}`, {
            method: 'DELETE',
        });
    }

    // Exámenes
    async getExamenes(filters?: { curso_id?: number; fecha?: string; tipo?: string; estado?: string }) {
        const queryParams = new URLSearchParams();
        if (filters?.curso_id) queryParams.append('curso_id', filters.curso_id.toString());
        if (filters?.fecha) queryParams.append('fecha', filters.fecha);
        if (filters?.tipo) queryParams.append('tipo', filters.tipo);
        if (filters?.estado) queryParams.append('estado', filters.estado);
        
        const query = queryParams.toString();
        return this.request<any[]>(`/api/examenes${query ? `?${query}` : ''}`);
    }

    async getExamen(id: number) {
        return this.request<any>(`/api/examenes/${id}`);
    }

    async createExamen(examen: any) {
        return this.request<any>('/api/examenes', {
            method: 'POST',
            body: JSON.stringify(examen),
        });
    }

    async updateExamen(id: number, examen: any) {
        return this.request<any>(`/api/examenes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(examen),
        });
    }

    async deleteExamen(id: number) {
        return this.request(`/api/examenes/${id}`, {
            method: 'DELETE',
        });
    }

    async getResultadosExamen(examenId: number) {
        return this.request<any[]>(`/api/examenes/${examenId}/resultados`);
    }

    async createOrUpdateResultado(examenId: number, resultado: any) {
        return this.request<any>(`/api/examenes/${examenId}/resultados`, {
            method: 'POST',
            body: JSON.stringify(resultado),
        });
    }

    // Carnets
    async getCarnets(filters?: { estado?: string; usuario_id?: number; codigo?: string; codigo_qr?: string }) {
        const queryParams = new URLSearchParams();
        if (filters?.estado) queryParams.append('estado', filters.estado);
        if (filters?.usuario_id) queryParams.append('usuario_id', filters.usuario_id.toString());
        if (filters?.codigo) queryParams.append('codigo', filters.codigo);
        if (filters?.codigo_qr) queryParams.append('codigo_qr', filters.codigo_qr);
        
        const query = queryParams.toString();
        return this.request<any[]>(`/api/carnets${query ? `?${query}` : ''}`);
    }

    async getCarnet(id: number) {
        return this.request<any>(`/api/carnets/${id}`);
    }

    async createCarnet(carnet: any) {
        return this.request<any>('/api/carnets', {
            method: 'POST',
            body: JSON.stringify(carnet),
        });
    }

    async updateCarnet(id: number, carnet: any) {
        return this.request<any>(`/api/carnets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(carnet),
        });
    }

    async deleteCarnet(id: number) {
        return this.request(`/api/carnets/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiService();
export default api;

