-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('estudiante', 'profesor', 'administrador');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('matriculado', 'pendiente', 'cancelado', 'completado');

-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('presente', 'ausente', 'tardio');

-- CreateEnum
CREATE TYPE "EstadoExamen" AS ENUM ('programado', 'completado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoResultado" AS ENUM ('presentado', 'ausente', 'reprobado');

-- CreateEnum
CREATE TYPE "TipoExamen" AS ENUM ('parcial', 'final', 'simulacro', 'quiz');

-- CreateEnum
CREATE TYPE "EstadoCarnet" AS ENUM ('activo', 'vencido', 'suspendido');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'activo',
    "fecha_registro" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ultima_conexion" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" INTEGER NOT NULL,
    "codigo_estudiante" TEXT NOT NULL,
    "carrera" TEXT NOT NULL,
    "semestre" INTEGER NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesores" (
    "id" INTEGER NOT NULL,
    "codigo_profesor" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "especialidad" TEXT,
    "titulo" TEXT NOT NULL,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "codigo_curso" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creditos" INTEGER NOT NULL,
    "horas_semanales" INTEGER NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "semestre" TEXT NOT NULL,
    "estado" "EstadoMatricula" NOT NULL DEFAULT 'pendiente',
    "fecha_matricula" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nota_final" DECIMAL(3,1),

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencia" (
    "id" SERIAL NOT NULL,
    "matricula_id" INTEGER NOT NULL,
    "codigo_qr" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_entrada" TIME NOT NULL,
    "estado" "EstadoAsistencia" NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes" (
    "id" SERIAL NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoExamen" NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "duracion_minutos" INTEGER NOT NULL,
    "estado" "EstadoExamen" NOT NULL DEFAULT 'programado',
    "puntaje_total" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "examenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultados_examenes" (
    "id" SERIAL NOT NULL,
    "examen_id" INTEGER NOT NULL,
    "matricula_id" INTEGER NOT NULL,
    "puntaje_obtenido" DECIMAL(5,2) NOT NULL,
    "fecha_presentacion" TIMESTAMP(3),
    "estado" "EstadoResultado" NOT NULL DEFAULT 'ausente',

    CONSTRAINT "resultados_examenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carnets" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "codigo_carnet" TEXT NOT NULL,
    "codigo_qr" TEXT NOT NULL,
    "fecha_expedicion" DATE NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "estado" "EstadoCarnet" NOT NULL DEFAULT 'activo',

    CONSTRAINT "carnets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_codigo_estudiante_key" ON "estudiantes"("codigo_estudiante");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_codigo_profesor_key" ON "profesores"("codigo_profesor");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_codigo_curso_key" ON "cursos"("codigo_curso");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_estudiante_id_curso_id_semestre_key" ON "matriculas"("estudiante_id", "curso_id", "semestre");

-- CreateIndex
CREATE UNIQUE INDEX "asistencia_matricula_id_fecha_key" ON "asistencia"("matricula_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "resultados_examenes_examen_id_matricula_id_key" ON "resultados_examenes"("examen_id", "matricula_id");

-- CreateIndex
CREATE UNIQUE INDEX "carnets_codigo_carnet_key" ON "carnets"("codigo_carnet");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesores" ADD CONSTRAINT "profesores_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "matriculas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes" ADD CONSTRAINT "examenes_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultados_examenes" ADD CONSTRAINT "resultados_examenes_examen_id_fkey" FOREIGN KEY ("examen_id") REFERENCES "examenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultados_examenes" ADD CONSTRAINT "resultados_examenes_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "matriculas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carnets" ADD CONSTRAINT "carnets_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
