import { Request, Response, NextFunction } from 'express';

// Colores para la consola (ANSI escape codes)
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

// Función para obtener el color según el código de estado
const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return colors.green;
    if (status >= 300 && status < 400) return colors.cyan;
    if (status >= 400 && status < 500) return colors.yellow;
    if (status >= 500) return colors.red;
    return colors.reset;
};

// Función para obtener el color según el método HTTP
const getMethodColor = (method: string): string => {
    switch (method) {
        case 'GET':
            return colors.blue;
        case 'POST':
            return colors.green;
        case 'PUT':
            return colors.yellow;
        case 'DELETE':
            return colors.red;
        case 'PATCH':
            return colors.magenta;
        default:
            return colors.reset;
    }
};

// Función para formatear el tiempo
const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
};

// Middleware de logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Log de inicio de petición
    const methodColor = getMethodColor(method);
    console.log(
        `${colors.dim}[${new Date().toISOString()}]${colors.reset} ` +
        `${methodColor}${method}${colors.reset} ` +
        `${colors.bright}${url}${colors.reset} ` +
        `${colors.dim}from ${ip}${colors.reset}`
    );

    // Interceptar el método res.end para capturar el código de estado
    const originalEnd = res.end.bind(res);
    res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const statusColor = getStatusColor(status);
        const timeColor = duration > 1000 ? colors.yellow : colors.dim;

        // Determinar si fue exitoso o falló
        const isSuccess = status >= 200 && status < 400;
        const statusIcon = isSuccess ? '✓' : '✗';
        const statusText = isSuccess ? 'SUCCESS' : 'ERROR';

        // Log de respuesta
        console.log(
            `${colors.dim}[${new Date().toISOString()}]${colors.reset} ` +
            `${statusColor}${status}${colors.reset} ` +
            `${methodColor}${method}${colors.reset} ` +
            `${colors.bright}${url}${colors.reset} ` +
            `${timeColor}${formatTime(duration)}${colors.reset} ` +
            `${statusColor}${statusIcon} ${statusText}${colors.reset}`
        );

        // Si hay error, mostrar más detalles
        if (status >= 400) {
            console.log(
                `${colors.red}  → Error: ${res.statusMessage || 'Unknown error'}${colors.reset}`
            );
        }

        // Llamar al método original
        return originalEnd(chunk, encoding, cb);
    } as typeof res.end;

    next();
};

// Middleware para loggear errores
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    const url = req.originalUrl || req.url;
    const methodColor = getMethodColor(method);

    console.error(
        `${colors.red}${colors.bright}[ERROR]${colors.reset} ` +
        `${methodColor}${method}${colors.reset} ` +
        `${colors.bright}${url}${colors.reset}`
    );
    console.error(`${colors.red}  → ${err.message}${colors.reset}`);
    if (err.stack && process.env.NODE_ENV === 'development') {
        console.error(`${colors.dim}${err.stack}${colors.reset}`);
    }

    next(err);
};

