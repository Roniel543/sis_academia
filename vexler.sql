--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2025-11-11 22:33:52

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 868 (class 1247 OID 42884)
-- Name: EstadoAsistencia; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoAsistencia" AS ENUM (
    'presente',
    'ausente',
    'tardio'
);


ALTER TYPE public."EstadoAsistencia" OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 42918)
-- Name: EstadoCarnet; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoCarnet" AS ENUM (
    'activo',
    'vencido',
    'suspendido'
);


ALTER TYPE public."EstadoCarnet" OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 42892)
-- Name: EstadoExamen; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoExamen" AS ENUM (
    'programado',
    'completado',
    'cancelado'
);


ALTER TYPE public."EstadoExamen" OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 42874)
-- Name: EstadoMatricula; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoMatricula" AS ENUM (
    'matriculado',
    'pendiente',
    'cancelado',
    'completado'
);


ALTER TYPE public."EstadoMatricula" OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 42900)
-- Name: EstadoResultado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoResultado" AS ENUM (
    'presentado',
    'ausente',
    'reprobado'
);


ALTER TYPE public."EstadoResultado" OWNER TO postgres;

--
-- TOC entry 862 (class 1247 OID 42868)
-- Name: EstadoUsuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoUsuario" AS ENUM (
    'activo',
    'inactivo'
);


ALTER TYPE public."EstadoUsuario" OWNER TO postgres;

--
-- TOC entry 859 (class 1247 OID 42860)
-- Name: Rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Rol" AS ENUM (
    'estudiante',
    'profesor',
    'administrador'
);


ALTER TYPE public."Rol" OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 42908)
-- Name: TipoExamen; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipoExamen" AS ENUM (
    'parcial',
    'final',
    'simulacro',
    'quiz'
);


ALTER TYPE public."TipoExamen" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 42850)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 42971)
-- Name: asistencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asistencia (
    id integer NOT NULL,
    matricula_id integer NOT NULL,
    codigo_qr text NOT NULL,
    fecha date NOT NULL,
    hora_entrada time without time zone NOT NULL,
    estado public."EstadoAsistencia" NOT NULL,
    observaciones text
);


ALTER TABLE public.asistencia OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 42970)
-- Name: asistencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asistencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 224
-- Name: asistencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asistencia_id_seq OWNED BY public.asistencia.id;


--
-- TOC entry 231 (class 1259 OID 42998)
-- Name: carnets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carnets (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    codigo_carnet text NOT NULL,
    codigo_qr text NOT NULL,
    fecha_expedicion date NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado public."EstadoCarnet" DEFAULT 'activo'::public."EstadoCarnet" NOT NULL
);


ALTER TABLE public.carnets OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 42997)
-- Name: carnets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carnets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carnets_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 230
-- Name: carnets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carnets_id_seq OWNED BY public.carnets.id;


--
-- TOC entry 221 (class 1259 OID 42951)
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id integer NOT NULL,
    codigo_curso text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    creditos integer NOT NULL,
    horas_semanales integer NOT NULL,
    nivel text NOT NULL
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 42950)
-- Name: cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 220
-- Name: cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_seq OWNED BY public.cursos.id;


--
-- TOC entry 218 (class 1259 OID 42936)
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudiantes (
    id integer NOT NULL,
    codigo_estudiante text NOT NULL,
    carrera text NOT NULL,
    semestre integer NOT NULL,
    telefono text,
    direccion text
);


ALTER TABLE public.estudiantes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 42980)
-- Name: examenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examenes (
    id integer NOT NULL,
    curso_id integer NOT NULL,
    nombre text NOT NULL,
    tipo public."TipoExamen" NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    duracion_minutos integer NOT NULL,
    estado public."EstadoExamen" DEFAULT 'programado'::public."EstadoExamen" NOT NULL,
    puntaje_total numeric(5,2) NOT NULL
);


ALTER TABLE public.examenes OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 42979)
-- Name: examenes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examenes_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 226
-- Name: examenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examenes_id_seq OWNED BY public.examenes.id;


--
-- TOC entry 223 (class 1259 OID 42960)
-- Name: matriculas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matriculas (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    curso_id integer NOT NULL,
    semestre text NOT NULL,
    estado public."EstadoMatricula" DEFAULT 'pendiente'::public."EstadoMatricula" NOT NULL,
    fecha_matricula timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    nota_final numeric(3,1)
);


ALTER TABLE public.matriculas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 42959)
-- Name: matriculas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matriculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matriculas_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 222
-- Name: matriculas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matriculas_id_seq OWNED BY public.matriculas.id;


--
-- TOC entry 219 (class 1259 OID 42943)
-- Name: profesores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesores (
    id integer NOT NULL,
    codigo_profesor text NOT NULL,
    departamento text NOT NULL,
    especialidad text,
    titulo text NOT NULL
);


ALTER TABLE public.profesores OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 42990)
-- Name: resultados_examenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados_examenes (
    id integer NOT NULL,
    examen_id integer NOT NULL,
    matricula_id integer NOT NULL,
    puntaje_obtenido numeric(5,2) NOT NULL,
    fecha_presentacion timestamp(3) without time zone,
    estado public."EstadoResultado" DEFAULT 'ausente'::public."EstadoResultado" NOT NULL
);


ALTER TABLE public.resultados_examenes OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 42989)
-- Name: resultados_examenes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultados_examenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultados_examenes_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 228
-- Name: resultados_examenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultados_examenes_id_seq OWNED BY public.resultados_examenes.id;


--
-- TOC entry 217 (class 1259 OID 42926)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_completo text NOT NULL,
    email text NOT NULL,
    contrasena text NOT NULL,
    rol public."Rol" NOT NULL,
    estado public."EstadoUsuario" DEFAULT 'activo'::public."EstadoUsuario" NOT NULL,
    fecha_registro timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion timestamp(3) without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 42925)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 216
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4764 (class 2604 OID 42974)
-- Name: asistencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia ALTER COLUMN id SET DEFAULT nextval('public.asistencia_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 43001)
-- Name: carnets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnets ALTER COLUMN id SET DEFAULT nextval('public.carnets_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 42954)
-- Name: cursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id SET DEFAULT nextval('public.cursos_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 42983)
-- Name: examenes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes ALTER COLUMN id SET DEFAULT nextval('public.examenes_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 42963)
-- Name: matriculas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas ALTER COLUMN id SET DEFAULT nextval('public.matriculas_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 42993)
-- Name: resultados_examenes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_examenes ALTER COLUMN id SET DEFAULT nextval('public.resultados_examenes_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 42929)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4951 (class 0 OID 42850)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1e4a8876-cce0-4fcf-9feb-a943547a25d9	90cd3184079d09865ad38f6e1e4e7309efffc0f866b68609b5881886fd916e6b	2025-11-10 23:14:54.963533-05	20251110142154_init	\N	\N	2025-11-10 23:14:54.81467-05	1
\.


--
-- TOC entry 4961 (class 0 OID 42971)
-- Dependencies: 225
-- Data for Name: asistencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asistencia (id, matricula_id, codigo_qr, fecha, hora_entrada, estado, observaciones) FROM stdin;
\.


--
-- TOC entry 4967 (class 0 OID 42998)
-- Dependencies: 231
-- Data for Name: carnets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carnets (id, usuario_id, codigo_carnet, codigo_qr, fecha_expedicion, fecha_vencimiento, estado) FROM stdin;
1	1	CARN-2025-001	QR-CARN-2025-001-1762835136459	2025-11-11	2026-01-16	activo
\.


--
-- TOC entry 4957 (class 0 OID 42951)
-- Dependencies: 221
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id, codigo_curso, nombre, descripcion, creditos, horas_semanales, nivel) FROM stdin;
\.


--
-- TOC entry 4954 (class 0 OID 42936)
-- Dependencies: 218
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estudiantes (id, codigo_estudiante, carrera, semestre, telefono, direccion) FROM stdin;
\.


--
-- TOC entry 4963 (class 0 OID 42980)
-- Dependencies: 227
-- Data for Name: examenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examenes (id, curso_id, nombre, tipo, fecha, hora_inicio, duracion_minutos, estado, puntaje_total) FROM stdin;
\.


--
-- TOC entry 4959 (class 0 OID 42960)
-- Dependencies: 223
-- Data for Name: matriculas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matriculas (id, estudiante_id, curso_id, semestre, estado, fecha_matricula, nota_final) FROM stdin;
\.


--
-- TOC entry 4955 (class 0 OID 42943)
-- Dependencies: 219
-- Data for Name: profesores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesores (id, codigo_profesor, departamento, especialidad, titulo) FROM stdin;
\.


--
-- TOC entry 4965 (class 0 OID 42990)
-- Dependencies: 229
-- Data for Name: resultados_examenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados_examenes (id, examen_id, matricula_id, puntaje_obtenido, fecha_presentacion, estado) FROM stdin;
\.


--
-- TOC entry 4953 (class 0 OID 42926)
-- Dependencies: 217
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre_completo, email, contrasena, rol, estado, fecha_registro, ultima_conexion) FROM stdin;
1	admin-vexler	admin-vexler@gmail.com	$2a$10$fBOan0Mmbp10qwKSd7xWxu8KXIBHA8Ef4MW1FbiAq1c3MhRs8sss.	administrador	activo	2025-11-11 04:24:40.693	2025-11-12 03:15:49.999
\.


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 224
-- Name: asistencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asistencia_id_seq', 1, false);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 230
-- Name: carnets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carnets_id_seq', 1, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 220
-- Name: cursos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_seq', 1, false);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 226
-- Name: examenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examenes_id_seq', 1, false);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 222
-- Name: matriculas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matriculas_id_seq', 1, false);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 228
-- Name: resultados_examenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resultados_examenes_id_seq', 1, false);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 216
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- TOC entry 4772 (class 2606 OID 42858)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 42978)
-- Name: asistencia asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 43006)
-- Name: carnets carnets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnets
    ADD CONSTRAINT carnets_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 42958)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 42942)
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 42988)
-- Name: examenes examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT examenes_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 42969)
-- Name: matriculas matriculas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 42949)
-- Name: profesores profesores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 42996)
-- Name: resultados_examenes resultados_examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_examenes
    ADD CONSTRAINT resultados_examenes_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 42935)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 1259 OID 43012)
-- Name: asistencia_matricula_id_fecha_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX asistencia_matricula_id_fecha_key ON public.asistencia USING btree (matricula_id, fecha);


--
-- TOC entry 4796 (class 1259 OID 43014)
-- Name: carnets_codigo_carnet_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX carnets_codigo_carnet_key ON public.carnets USING btree (codigo_carnet);


--
-- TOC entry 4782 (class 1259 OID 43010)
-- Name: cursos_codigo_curso_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cursos_codigo_curso_key ON public.cursos USING btree (codigo_curso);


--
-- TOC entry 4776 (class 1259 OID 43008)
-- Name: estudiantes_codigo_estudiante_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estudiantes_codigo_estudiante_key ON public.estudiantes USING btree (codigo_estudiante);


--
-- TOC entry 4785 (class 1259 OID 43011)
-- Name: matriculas_estudiante_id_curso_id_semestre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX matriculas_estudiante_id_curso_id_semestre_key ON public.matriculas USING btree (estudiante_id, curso_id, semestre);


--
-- TOC entry 4779 (class 1259 OID 43009)
-- Name: profesores_codigo_profesor_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX profesores_codigo_profesor_key ON public.profesores USING btree (codigo_profesor);


--
-- TOC entry 4793 (class 1259 OID 43013)
-- Name: resultados_examenes_examen_id_matricula_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX resultados_examenes_examen_id_matricula_id_key ON public.resultados_examenes USING btree (examen_id, matricula_id);


--
-- TOC entry 4773 (class 1259 OID 43007)
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- TOC entry 4803 (class 2606 OID 43035)
-- Name: asistencia asistencia_matricula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_matricula_id_fkey FOREIGN KEY (matricula_id) REFERENCES public.matriculas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4807 (class 2606 OID 43055)
-- Name: carnets carnets_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnets
    ADD CONSTRAINT carnets_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 43015)
-- Name: estudiantes estudiantes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_id_fkey FOREIGN KEY (id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4804 (class 2606 OID 43040)
-- Name: examenes examenes_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT examenes_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 43030)
-- Name: matriculas matriculas_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 43025)
-- Name: matriculas matriculas_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 43020)
-- Name: profesores profesores_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_id_fkey FOREIGN KEY (id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 43045)
-- Name: resultados_examenes resultados_examenes_examen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_examenes
    ADD CONSTRAINT resultados_examenes_examen_id_fkey FOREIGN KEY (examen_id) REFERENCES public.examenes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4806 (class 2606 OID 43050)
-- Name: resultados_examenes resultados_examenes_matricula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_examenes
    ADD CONSTRAINT resultados_examenes_matricula_id_fkey FOREIGN KEY (matricula_id) REFERENCES public.matriculas(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-11-11 22:33:52

--
-- PostgreSQL database dump complete
--

