import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Curso } from '../../types';
import { cursoSchema, type CursoFormData } from '../../validations/curso.schema';

interface CursoFormProps {
    curso: Curso | null;
    onSubmit: (cursoData: Omit<Curso, 'id'>) => void;
    onCancel: () => void;
}

/**
 * Formulario de Curso con validaciones robustas usando react-hook-form + zod
 */
export const CursoForm = ({ curso, onSubmit, onCancel }: CursoFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<CursoFormData>({
        resolver: zodResolver(cursoSchema),
        defaultValues: {
            codigo_curso: curso?.codigo_curso || '',
            nombre: curso?.nombre || '',
            descripcion: curso?.descripcion || '',
            creditos: curso?.creditos || ('' as any),
            horas_semanales: curso?.horas_semanales || ('' as any),
            nivel: curso?.nivel || '',
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        reset({
            codigo_curso: curso?.codigo_curso || '',
            nombre: curso?.nombre || '',
            descripcion: curso?.descripcion || '',
            creditos: curso?.creditos || ('' as any),
            horas_semanales: curso?.horas_semanales || ('' as any),
            nivel: curso?.nivel || '',
        });
    }, [curso, reset]);

    const onFormSubmit = (data: CursoFormData) => {
        onSubmit({
            codigo_curso: data.codigo_curso,
            nombre: data.nombre,
            descripcion: data.descripcion || undefined,
            creditos: data.creditos,
            horas_semanales: data.horas_semanales,
            nivel: data.nivel,
        });
    };

    const codigoValue = watch('codigo_curso');

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Curso <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('codigo_curso')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                        errors.codigo_curso ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MAT-101"
                    style={{ textTransform: 'uppercase' }}
                />
                {errors.codigo_curso && (
                    <p className="text-xs text-red-600 mt-1">{errors.codigo_curso.message}</p>
                )}
                {codigoValue && !errors.codigo_curso && (
                    <p className="text-xs text-green-600 mt-1">✓ Formato válido</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Curso <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('nombre')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Matemáticas I"
                />
                {errors.nombre && (
                    <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    {...register('descripcion')}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.descripcion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Descripción del curso..."
                />
                {errors.descripcion && (
                    <p className="text-xs text-red-600 mt-1">{errors.descripcion.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Créditos <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register('creditos', { valueAsNumber: true })}
                        min={1}
                        max={10}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.creditos ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.creditos && (
                        <p className="text-xs text-red-600 mt-1">{errors.creditos.message}</p>
                    )}
                    {!errors.creditos && (
                        <p className="text-xs text-gray-500 mt-1">Entre 1 y 10</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horas Semanales <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register('horas_semanales', { valueAsNumber: true })}
                        min={1}
                        max={20}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.horas_semanales ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.horas_semanales && (
                        <p className="text-xs text-red-600 mt-1">{errors.horas_semanales.message}</p>
                    )}
                    {!errors.horas_semanales && (
                        <p className="text-xs text-gray-500 mt-1">Entre 1 y 20</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('nivel')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nivel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Básico, Intermedio, Avanzado"
                />
                {errors.nivel && (
                    <p className="text-xs text-red-600 mt-1">{errors.nivel.message}</p>
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
                    {isSubmitting ? 'Guardando...' : curso ? 'Actualizar' : 'Crear'} Curso
                </button>
            </div>
        </form>
    );
};

