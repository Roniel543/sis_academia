import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UsuarioUI } from '../../types';
import { createUsuarioSchema, updateUsuarioSchema, type CreateUsuarioFormData, type UpdateUsuarioFormData } from '../../validations/usuario.schema';

interface UsuarioFormProps {
    user: UsuarioUI | null;
    onSubmit: (userData: Omit<UsuarioUI, 'id'>) => void;
    onCancel: () => void;
}

/**
 * Formulario de Usuario con validaciones robustas usando react-hook-form + zod
 * 
 * Ventajas sobre la versión anterior:
 * - Validación en tiempo real
 * - Mensajes de error claros y específicos
 * - Menos código boilerplate
 * - Type-safe con TypeScript
 * - Consistente con validaciones del backend
 * - Mejor UX con feedback inmediato
 */
export const UsuarioForm = ({ user, onSubmit, onCancel }: UsuarioFormProps) => {
    const isEditMode = !!user;
    const schema = isEditMode ? updateUsuarioSchema : createUsuarioSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<CreateUsuarioFormData | UpdateUsuarioFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombre_completo: user?.nombre_completo || '',
            email: user?.email || '',
            contrasena: '',
            rol: user?.rol || 'estudiante',
            estado: user?.estado || 'activo',
        },
        mode: 'onBlur', // Validar al perder el foco
    });

    // Resetear formulario cuando cambia el usuario
    useEffect(() => {
        reset({
            nombre_completo: user?.nombre_completo || '',
            email: user?.email || '',
            contrasena: '',
            rol: user?.rol || 'estudiante',
            estado: user?.estado || 'activo',
        });
    }, [user, reset]);

    const onFormSubmit = (data: CreateUsuarioFormData | UpdateUsuarioFormData) => {
        // Preparar datos para el backend
        const dataToSubmit: any = {
            nombre_completo: data.nombre_completo,
            email: data.email,
            rol: data.rol,
            estado: data.estado,
        };

        // Solo incluir contraseña si se proporciona
        if (data.contrasena && data.contrasena.trim() !== '') {
            dataToSubmit.contrasena = data.contrasena;
        }

        onSubmit(dataToSubmit);
    };

    const passwordValue = watch('contrasena');

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('nombre_completo')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nombre_completo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan Pérez"
                />
                {errors.nombre_completo && (
                    <p className="text-xs text-red-600 mt-1">{errors.nombre_completo.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="juan@example.com"
                />
                {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {isEditMode && <span className="text-gray-500">(opcional)</span>}
                    {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <input
                    type="password"
                    {...register('contrasena')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.contrasena ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEditMode ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                />
                {errors.contrasena && (
                    <p className="text-xs text-red-600 mt-1">{errors.contrasena.message}</p>
                )}
                {!isEditMode && passwordValue && (
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">La contraseña debe contener:</p>
                        <ul className="text-xs text-gray-500 list-disc list-inside">
                            <li className={passwordValue.length >= 6 ? 'text-green-600' : ''}>
                                Al menos 6 caracteres
                            </li>
                            <li className={/.*[a-z].*/.test(passwordValue) ? 'text-green-600' : ''}>
                                Una letra minúscula
                            </li>
                            <li className={/.*[A-Z].*/.test(passwordValue) ? 'text-green-600' : ''}>
                                Una letra mayúscula
                            </li>
                            <li className={/.*\d.*/.test(passwordValue) ? 'text-green-600' : ''}>
                                Un número
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('rol')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.rol ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                    <option value="administrador">Administrador</option>
                </select>
                {errors.rol && (
                    <p className="text-xs text-red-600 mt-1">{errors.rol.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('estado')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
                {errors.estado && (
                    <p className="text-xs text-red-600 mt-1">{errors.estado.message}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};
