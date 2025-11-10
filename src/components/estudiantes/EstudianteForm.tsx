import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Estudiante } from '../../types';
import type { Usuario } from '../../types';
import { estudianteSchema, type EstudianteFormData } from '../../validations/estudiante.schema';

interface EstudianteFormProps {
    estudiante: (Estudiante & { usuario?: Usuario }) | null;
    usuarios: Usuario[]; // Lista de usuarios disponibles (rol: estudiante)
    onSubmit: (estudianteData: Omit<Estudiante, 'id'> & { usuario_id: number }) => void;
    onCancel: () => void;
}

/**
 * Formulario de Estudiante con validaciones robustas usando react-hook-form + zod
 */
export const EstudianteForm = ({ estudiante, usuarios, onSubmit, onCancel }: EstudianteFormProps) => {
    // Filtrar solo usuarios con rol estudiante
    const usuariosDisponibles = usuarios.filter((u) => u.rol === 'estudiante');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<EstudianteFormData>({
        resolver: zodResolver(estudianteSchema),
        defaultValues: {
            usuario_id: estudiante?.id || ('' as any),
            codigo_estudiante: estudiante?.codigo_estudiante || '',
            carrera: estudiante?.carrera || '',
            semestre: estudiante?.semestre || ('' as any),
            telefono: estudiante?.telefono || '',
            direccion: estudiante?.direccion || '',
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        reset({
            usuario_id: estudiante?.id || ('' as any),
            codigo_estudiante: estudiante?.codigo_estudiante || '',
            carrera: estudiante?.carrera || '',
            semestre: estudiante?.semestre || ('' as any),
            telefono: estudiante?.telefono || '',
            direccion: estudiante?.direccion || '',
        });
    }, [estudiante, reset]);

    const onFormSubmit = (data: EstudianteFormData) => {
        onSubmit({
            usuario_id: data.usuario_id,
            codigo_estudiante: data.codigo_estudiante,
            carrera: data.carrera,
            semestre: data.semestre,
            telefono: data.telefono || undefined,
            direccion: data.direccion || undefined,
        });
    };

    const codigoValue = watch('codigo_estudiante');

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('usuario_id', { valueAsNumber: true })}
                    disabled={!!estudiante}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                        errors.usuario_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Seleccione un usuario</option>
                    {usuariosDisponibles.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {usuario.nombre_completo} ({usuario.email})
                        </option>
                    ))}
                </select>
                {errors.usuario_id && (
                    <p className="text-xs text-red-600 mt-1">{errors.usuario_id.message}</p>
                )}
                {usuariosDisponibles.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                        No hay usuarios con rol "estudiante" disponibles. Cree un usuario primero.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Estudiante <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('codigo_estudiante')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                        errors.codigo_estudiante ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="EST001"
                    style={{ textTransform: 'uppercase' }}
                />
                {errors.codigo_estudiante && (
                    <p className="text-xs text-red-600 mt-1">{errors.codigo_estudiante.message}</p>
                )}
                {codigoValue && !errors.codigo_estudiante && (
                    <p className="text-xs text-green-600 mt-1">✓ Formato válido</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('carrera')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.carrera ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingeniería de Sistemas"
                />
                {errors.carrera && (
                    <p className="text-xs text-red-600 mt-1">{errors.carrera.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semestre <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    {...register('semestre', { valueAsNumber: true })}
                    min={1}
                    max={20}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.semestre ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.semestre && (
                    <p className="text-xs text-red-600 mt-1">{errors.semestre.message}</p>
                )}
                {!errors.semestre && (
                    <p className="text-xs text-gray-500 mt-1">Entre 1 y 20</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                    type="tel"
                    {...register('telefono')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+51 999 999 999"
                />
                {errors.telefono && (
                    <p className="text-xs text-red-600 mt-1">{errors.telefono.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea
                    {...register('direccion')}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.direccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Dirección completa"
                />
                {errors.direccion && (
                    <p className="text-xs text-red-600 mt-1">{errors.direccion.message}</p>
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
                    {isSubmitting ? 'Guardando...' : estudiante ? 'Actualizar' : 'Crear'} Estudiante
                </button>
            </div>
        </form>
    );
};
