import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MatriculaUI } from '../../types';
import { useEstudiantes } from '../../hooks/useEstudiantes';
import api from '../../services/api';
import { matriculaSchema, type MatriculaFormData } from '../../validations/matricula.schema';

interface MatriculaFormProps {
    enrollment: MatriculaUI | null;
    onSubmit: (enrollmentData: Omit<MatriculaUI, 'id'>) => void;
    onCancel: () => void;
}

interface Curso {
    id: number;
    codigo_curso: string;
    nombre: string;
}

/**
 * Formulario de Matrícula con validaciones robustas usando react-hook-form + zod
 */
export const MatriculaForm = ({ enrollment, onSubmit, onCancel }: MatriculaFormProps) => {
    const { estudiantes } = useEstudiantes();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loadingCursos, setLoadingCursos] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<MatriculaFormData>({
        resolver: zodResolver(matriculaSchema),
        defaultValues: {
            estudiante_id: (enrollment as any)?.estudiante_id || ('' as any),
            curso_id: (enrollment as any)?.curso_id || ('' as any),
            semestre: enrollment?.semester || '',
            estado: enrollment?.status === 'enrolled' ? 'matriculado' : enrollment?.status === 'completed' ? 'completado' : enrollment?.status === 'cancelled' ? 'cancelado' : 'pendiente',
            nota_final: enrollment?.grade || ('' as any),
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
        if (enrollment) {
            const estudiante = estudiantes.find(
                (e) => e.usuario?.nombre_completo === enrollment.student
            );
            const curso = cursos.find((c) => c.nombre === enrollment.course);

            reset({
                estudiante_id: estudiante?.id || (enrollment as any)?.estudiante_id || ('' as any),
                curso_id: curso?.id || (enrollment as any)?.curso_id || ('' as any),
                semestre: enrollment.semester,
                estado: enrollment.status === 'enrolled' ? 'matriculado' : enrollment.status === 'completed' ? 'completado' : enrollment.status === 'cancelled' ? 'cancelado' : 'pendiente',
                nota_final: enrollment.grade || ('' as any),
            });
        } else {
            reset({
                estudiante_id: ('' as any),
                curso_id: ('' as any),
                semestre: '',
                estado: 'pendiente',
                nota_final: ('' as any),
            });
        }
    }, [enrollment, estudiantes, cursos, reset]);

    const onFormSubmit = (data: MatriculaFormData) => {
        // Encontrar nombres para el formato UI
        const estudiante = estudiantes.find((e) => e.id === data.estudiante_id);
        const curso = cursos.find((c) => c.id === data.curso_id);

        if (!estudiante || !curso) {
            return;
        }

        // Convertir a formato UI
        const enrollmentData: Omit<MatriculaUI, 'id'> = {
            student: estudiante.usuario?.nombre_completo || '',
            course: curso.nombre,
            semester: data.semestre,
            status: data.estado === 'matriculado' ? 'enrolled' : data.estado === 'completado' ? 'completed' : data.estado === 'cancelado' ? 'cancelled' : 'pending',
            date: new Date().toISOString().split('T')[0],
            grade: data.nota_final || undefined,
            estudiante_id: data.estudiante_id,
            curso_id: data.curso_id,
        };

        onSubmit(enrollmentData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estudiante <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('estudiante_id', { valueAsNumber: true })}
                    disabled={!!enrollment}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                        errors.estudiante_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((estudiante) => (
                        <option key={estudiante.id} value={estudiante.id}>
                            {estudiante.codigo_estudiante} - {estudiante.usuario?.nombre_completo} ({estudiante.usuario?.email})
                        </option>
                    ))}
                </select>
                {errors.estudiante_id && (
                    <p className="text-xs text-red-600 mt-1">{errors.estudiante_id.message}</p>
                )}
                {estudiantes.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                        No hay estudiantes registrados. Cree un estudiante primero.
                    </p>
                )}
            </div>

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
                        disabled={!!enrollment}
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
                    Semestre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('semestre')}
                    placeholder="2024-1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.semestre ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.semestre && (
                    <p className="text-xs text-red-600 mt-1">{errors.semestre.message}</p>
                )}
                {!errors.semestre && (
                    <p className="text-xs text-gray-500 mt-1">Formato: Año-Período (ej: 2024-1)</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                    {...register('estado')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="matriculado">Matriculado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="completado">Completado</option>
                </select>
                {errors.estado && (
                    <p className="text-xs text-red-600 mt-1">{errors.estado.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota Final</label>
                <input
                    type="number"
                    {...register('nota_final', { valueAsNumber: true })}
                    min={0}
                    max={20}
                    step={0.01}
                    placeholder="0.00 - 20.00"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nota_final ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.nota_final && (
                    <p className="text-xs text-red-600 mt-1">{errors.nota_final.message}</p>
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
                    {isSubmitting ? 'Guardando...' : enrollment ? 'Actualizar' : 'Crear'} Matrícula
                </button>
            </div>
        </form>
    );
};
