import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ExamenUI } from '../../types';
import api from '../../services/api';
import { examenSchema, type ExamenFormData } from '../../validations/examen.schema';

interface ExamenFormProps {
    exam: ExamenUI | null;
    onSubmit: (examData: Omit<ExamenUI, 'id'>) => void;
    onCancel: () => void;
}

interface Curso {
    id: number;
    codigo_curso: string;
    nombre: string;
}

/**
 * Formulario de Examen con validaciones robustas usando react-hook-form + zod
 */
export const ExamenForm = ({ exam, onSubmit, onCancel }: ExamenFormProps) => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loadingCursos, setLoadingCursos] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ExamenFormData>({
        resolver: zodResolver(examenSchema),
        defaultValues: {
            curso_id: (exam as any)?.curso_id || ('' as any),
            nombre: exam?.name || '',
            tipo: exam?.type || 'parcial',
            fecha: exam?.date || new Date().toISOString().split('T')[0],
            hora_inicio: exam?.time || '08:00:00',
            duracion_minutos: exam?.duration ? parseInt(exam.duration.replace(/\D/g, '')) : ('' as any),
            estado: exam?.status === 'scheduled' ? 'programado' : exam?.status === 'completed' ? 'completado' : 'programado',
            puntaje_total: exam?.totalScore || 20,
        },
        mode: 'onBlur',
    });

    // Cargar cursos al montar el componente
    useEffect(() => {
        const loadCursos = async () => {
            try {
                const response = await api.getCursos();
                if (response.success && response.data) {
                    setCursos(response.data);
                }
            } catch (error) {
                console.error('Error al cargar cursos:', error);
            } finally {
                setLoadingCursos(false);
            }
        };
        loadCursos();
    }, []);

    useEffect(() => {
        if (exam) {
            const curso = cursos.find((c) => c.nombre === exam.course);

            reset({
                curso_id: curso?.id || (exam as any)?.curso_id || ('' as any),
                nombre: exam.name,
                tipo: exam.type || 'parcial',
                fecha: exam.date,
                hora_inicio: exam.time || '08:00:00',
                duracion_minutos: exam.duration ? parseInt(exam.duration.replace(/\D/g, '')) : ('' as any),
                estado: exam.status === 'scheduled' ? 'programado' : exam.status === 'completed' ? 'completado' : 'programado',
                puntaje_total: exam.totalScore || 20,
            });
        } else {
            reset({
                curso_id: ('' as any),
                nombre: '',
                tipo: 'parcial',
                fecha: new Date().toISOString().split('T')[0],
                hora_inicio: '08:00:00',
                duracion_minutos: ('' as any),
                estado: 'programado',
                puntaje_total: 20,
            });
        }
    }, [exam, cursos, reset]);

    const onFormSubmit = (data: ExamenFormData) => {
        const curso = cursos.find((c) => c.id === data.curso_id);

        if (!curso) {
            return;
        }

        // Convertir a formato UI
        const examData: Omit<ExamenUI, 'id'> = {
            name: data.nombre,
            course: curso.nombre,
            date: data.fecha,
            time: data.hora_inicio,
            duration: `${data.duracion_minutos} minutos`,
            students: 0,
            status: data.estado === 'programado' ? 'scheduled' : data.estado === 'completado' ? 'completed' : 'cancelled',
            type: data.tipo,
            totalScore: data.puntaje_total,
            curso_id: data.curso_id,
        };

        onSubmit(examData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso <span className="text-red-500">*</span>
                </label>
                {loadingCursos ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500">Cargando cursos...</p>
                    </div>
                ) : (
                    <select
                        {...register('curso_id', { valueAsNumber: true })}
                        disabled={!!exam}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                            errors.curso_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Seleccione un curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.id} value={curso.id}>
                                {curso.codigo_curso} - {curso.nombre}
                            </option>
                        ))}
                    </select>
                )}
                {errors.curso_id && (
                    <p className="text-xs text-red-600 mt-1">{errors.curso_id.message}</p>
                )}
                {!loadingCursos && cursos.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                        No hay cursos disponibles. Cree un curso primero.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Examen <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('nombre')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Examen Parcial 1"
                />
                {errors.nombre && (
                    <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Examen <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('tipo')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.tipo ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="parcial">Parcial</option>
                    <option value="final">Final</option>
                    <option value="simulacro">Simulacro</option>
                    <option value="quiz">Quiz</option>
                </select>
                {errors.tipo && (
                    <p className="text-xs text-red-600 mt-1">{errors.tipo.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        {...register('fecha')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.fecha ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.fecha && (
                        <p className="text-xs text-red-600 mt-1">{errors.fecha.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        {...register('hora_inicio', {
                            setValueAs: (value: string) => {
                                // Asegurar formato HH:MM:SS
                                if (value && !value.includes(':')) return value;
                                return value ? `${value}:00` : '08:00:00';
                            },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.hora_inicio ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.hora_inicio && (
                        <p className="text-xs text-red-600 mt-1">{errors.hora_inicio.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duración (minutos) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register('duracion_minutos', { valueAsNumber: true })}
                        min={1}
                        placeholder="120"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.duracion_minutos ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.duracion_minutos && (
                        <p className="text-xs text-red-600 mt-1">{errors.duracion_minutos.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntaje Total <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register('puntaje_total', { valueAsNumber: true })}
                        min={1}
                        step={0.01}
                        placeholder="20"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.puntaje_total ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.puntaje_total && (
                        <p className="text-xs text-red-600 mt-1">{errors.puntaje_total.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                    {...register('estado')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="programado">Programado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
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
                    {isSubmitting ? 'Guardando...' : exam ? 'Actualizar' : 'Crear'} Examen
                </button>
            </div>
        </form>
    );
};
