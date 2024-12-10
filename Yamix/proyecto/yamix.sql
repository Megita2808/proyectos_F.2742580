-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-12-2024 a las 21:23:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `yamix`
--

-- --------------------------------------------------------
create database yamix;
use yamix;
--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id_asistencia` int(11) NOT NULL,
  `id_clase` int(11) DEFAULT NULL,
  `fecha_asistencia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`id_asistencia`, `id_clase`, `fecha_asistencia`) VALUES
(44, 19, '2024-12-03'),
(45, 19, '2024-11-11'),
(46, 21, '2024-12-02'),
(47, 19, '2024-11-12'),
(48, 20, '2024-12-04'),
(49, 19, '2024-12-05'),
(50, 21, '2024-12-05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias_estudiantes`
--

CREATE TABLE `asistencias_estudiantes` (
  `id_asistencia` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `presente` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencias_estudiantes`
--

INSERT INTO `asistencias_estudiantes` (`id_asistencia`, `id_usuario`, `presente`) VALUES
(44, 53, 1),
(44, 54, 1),
(44, 55, 1),
(45, 53, 1),
(45, 54, 0),
(45, 55, 1),
(46, 55, 1),
(46, 54, 1),
(46, 57, 0),
(47, 55, 0),
(47, 53, 1),
(47, 54, 0),
(48, 57, 1),
(49, 55, 0),
(49, 53, 1),
(49, 54, 0),
(50, NULL, 1),
(50, NULL, 0),
(50, NULL, 1),
(50, 54, 0),
(50, 55, 0),
(50, 57, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo`
--

CREATE TABLE `catalogo` (
  `id_catalogo` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_producto` varchar(255) DEFAULT NULL,
  `link` text NOT NULL,
  `id_curso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo`
--

INSERT INTO `catalogo` (`id_catalogo`, `nombre_producto`, `descripcion`, `imagen_producto`, `link`, `id_curso`) VALUES
(10, 'Guantes de box', 'box', '/uploads/1733254910761.webp', 'https://articulo.mercadolibre.com.co/MCO-1784232978-guantes-de-boxeo-profesionales-negros-box-14-onzas-mma-elite-_JM#polycard_client=search-nordic&position=4&search_layout=grid&type=item&tracking_id=c1ddd41b-d965-4970-8c24-f84cbfa31ac2', 26),
(11, 'Guantes de MMa', 'estilo callejero', '/uploads/1733254683945.jpg', 'https://articulo.mercadolibre.com.co/MCO-614751817-guantes-mma-kick-boxing-boxeo-artes-marciales-mixtas-force-_JM#polycard_client=search-nordic&position=14&search_layout=grid&type=item&tracking_id=059eaebb-e2fa-4cd3-bd20-b7fcb5fb3194', 27),
(12, 'Tenis para parkour', 'para saltar bien alto', '/uploads/1733254829071.webp', 'https://articulo.mercadolibre.com.co/MCO-2417670234-tenis-galaxy-6-gw3848-adidas-_JM#polycard_client=search-nordic&position=24&search_layout=grid&type=item&tracking_id=28e82f27-8648-42c8-8434-8f993cf9b238', 25),
(13, 'Guantes', 'mejor agarre', '/uploads/1733255522401.jpeg', 'https://articulo.mercadolibre.com.co/MCO-1340559585-guantes-con-munequera-gimnasio-pesas-gym-sports-deporte-_JM#polycard_client=search-nordic&position=16&search_layout=grid&type=item&tracking_id=3dd2f944-4449-4ffc-abbf-81c40d598512', 25),
(14, 'Tenis Para Martha', 'Tenis exclusivos para Martha', '/uploads/1733264054709.jpeg', 'https://www.youtube.com/', 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases`
--

CREATE TABLE `clases` (
  `id_clase` int(11) NOT NULL,
  `id_curso` int(11) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_final` time DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases`
--

INSERT INTO `clases` (`id_clase`, `id_curso`, `hora_inicio`, `hora_final`, `id_usuario`, `estado`) VALUES
(19, 25, '08:00:00', '10:00:00', 52, 'activo'),
(20, 26, '11:00:00', '11:30:00', 56, 'activo'),
(21, 28, '16:00:00', '18:00:00', 52, 'activo'),
(22, 26, '13:00:00', '15:00:00', 52, 'activo'),
(23, 26, '18:01:00', '20:00:00', 56, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases_estudiantes`
--

CREATE TABLE `clases_estudiantes` (
  `id_clase_estudianate` int(11) NOT NULL,
  `id_clase` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_agregado` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases_estudiantes`
--

INSERT INTO `clases_estudiantes` (`id_clase_estudianate`, `id_clase`, `id_usuario`, `fecha_agregado`) VALUES
(79, 19, 53, '2024-11-10'),
(81, 19, 55, '2024-11-10'),
(85, 19, 54, '2024-11-11'),
(88, 20, 57, '2024-11-10'),
(89, 21, 54, '2024-11-10'),
(90, 21, 55, '2024-11-10'),
(91, 21, 57, '2024-11-11'),
(92, 20, 54, '2024-12-05'),
(107, 22, 61, '2024-12-05'),
(108, 21, 61, '2024-12-05'),
(109, 19, 61, '2024-12-05'),
(112, 22, 53, '2024-12-07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` int(11) NOT NULL,
  `nombre_curso` varchar(100) DEFAULT NULL,
  `link` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id_curso`, `nombre_curso`, `link`, `descripcion`, `estado`) VALUES
(25, 'Parkour', 'uploads\\1733248959775.jpeg', 'saltar', 'activo'),
(26, 'Boxeo', 'uploads\\1733254192077.jpeg', 'boxeo en el ring', 'activo'),
(27, 'Mixtas', 'uploads\\1733254151651.webp', 'Estilo callejero', 'activo'),
(28, 'programacion', 'uploads\\1733262871586.webp', 'programar', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos_instructores`
--

CREATE TABLE `cursos_instructores` (
  `id_curso_instructor` int(11) NOT NULL,
  `id_curso` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_usuarios`
--

CREATE TABLE `datos_usuarios` (
  `id_datos_usuario` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_usuarios`
--

INSERT INTO `datos_usuarios` (`id_datos_usuario`, `id_usuario`, `nombre`, `apellido`, `fecha_nacimiento`, `estado`) VALUES
(1, 1, 'Juan Camilo', 'Arbelaez Diaz', '2001-02-21', 'habilitado'),
(49, 52, 'Andres', 'Gomez', '2003-12-04', 'habilitado'),
(50, 53, 'matias', 'serna', '2006-12-04', 'habilitado'),
(51, 54, 'santiago ', 'henao', '2005-12-12', 'habilitado'),
(52, 55, 'rodolfo', 'hernandez', '2005-12-06', 'habilitado'),
(53, 56, 'Matias', 'Arbelaez Diaz', '2004-12-04', 'habilitado'),
(54, 57, 'Martha', 'Gomez', '2003-12-12', 'habilitado'),
(55, 58, 'Juan', 'Betancur', '2003-12-04', 'espera'),
(56, 59, 'Mathiws', 'Arbelaez Diaz', '2001-11-11', 'habilitado'),
(57, 60, 'Christian Mathiws', 'Torres Serna', '2002-11-11', 'habilitado'),
(58, 61, 'Mathiws', 'Torres Serna', '2002-11-11', 'deshabilitado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id_documento` int(11) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id_documento`, `ruta_archivo`, `id_usuario`) VALUES
(50, '/uploads/documents/1733250648681.pdf', 54),
(51, '/uploads/documents/1733262439435.pdf', 57),
(64, '/uploads/documents/1733594680295.sql', 61);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `nombre_evento` varchar(100) DEFAULT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_hora_inicio` datetime DEFAULT NULL,
  `fecha_hora_final` datetime DEFAULT NULL,
  `id_curso` int(11) DEFAULT NULL,
  `color_evento` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id_evento`, `nombre_evento`, `descripcion`, `ubicacion`, `fecha_hora_inicio`, `fecha_hora_final`, `id_curso`, `color_evento`, `estado`) VALUES
(9, 'Parkour municipal', 'torneo de parkour', 'a', '2024-12-16 00:00:00', '2024-12-19 00:00:00', 25, '#9c27b0', 'activo'),
(10, 'Torneo mixtas', 'Artes mixtas', 'Cancha La Pedrera Cl. 52 #44-05, Copacabana, Antioquia', '2024-12-19 00:00:00', '2024-12-22 00:00:00', 27, '#2196F3', 'activo'),
(11, 'Torneo boxeo', 'box', 'Cancha La Pedrera Cl. 52 #44-05, Copacabana, Antioquia', '2024-12-13 00:00:00', '2024-12-16 00:00:00', 26, '#8BC34A', 'activo'),
(12, 'progrmacion', 'dasdas', 'dasd', '2024-12-04 00:00:00', '2024-12-07 00:00:00', 28, '#009688', 'activo'),
(13, 'Clase gratis box', 'boxeo gratis prueba', 'sdaasd', '2024-12-09 00:00:00', '2024-12-12 00:00:00', 26, '#FFC107', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` int(11) NOT NULL,
  `nombre_permiso` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `nombre_permiso`) VALUES
(1, 'dashboard'),
(2, 'permisos'),
(3, 'usuarios'),
(4, 'asistencia admin'),
(5, 'clases'),
(6, 'calendario'),
(7, 'catalogo admin'),
(8, 'asistencia profesor'),
(9, 'perfil'),
(10, 'cursos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_rol`
--

CREATE TABLE `permisos_rol` (
  `id_permiso_rol` int(11) NOT NULL,
  `id_permiso` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos_rol`
--

INSERT INTO `permisos_rol` (`id_permiso_rol`, `id_permiso`, `id_rol`) VALUES
(457, 8, 2),
(458, 9, 2),
(459, 9, 1),
(460, 9, 4),
(461, 1, 3),
(462, 2, 3),
(463, 3, 3),
(464, 4, 3),
(465, 5, 3),
(466, 6, 3),
(467, 7, 3),
(468, 8, 3),
(469, 9, 3),
(470, 10, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'Estudiante'),
(2, 'profesor'),
(3, 'administrador'),
(4, 'miembro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contraseña` varchar(100) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `codigoRecuperacion` varchar(255) DEFAULT NULL,
  `codigoExpiracion` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo`, `contraseña`, `id_rol`, `codigoRecuperacion`, `codigoExpiracion`) VALUES
(1, 'camiloardi22@gmail.com', '$2a$10$NSYNov831oCoyr68nqnP4.IlnVahPI1e27kBVL92K9d1RYRPAaKIy', 3, NULL, NULL),
(52, 'mathiws112@gmail.com', '$2a$10$tKg6bVGunLY7HnPu12qLx.DQcZPQ3NWpvUMu4NRuoD3fF/t80.Fve', 2, NULL, NULL),
(53, 'juan2112@gmail.com', '$2b$10$6EKfCeqj4ExBjxU2P6gV6uaVtfRPFqShqRv6OVE1JfOKwWw4L5Wo.', 1, NULL, NULL),
(54, 'juan21@gmail.com', '$2b$10$3p1I/UzLGZR1WMpYyaMFxOWnwn0N8x3lkaqU8JHCoFiQHDRgeF/Ta', 1, NULL, NULL),
(55, 'juan13@gmail.com', '$2b$10$s6eDGiR3HI3GBOHhP7N6ieUAM9djcLbvlipASROudRcu/OHVBkyCC', 1, NULL, NULL),
(56, 'juan14@gmail.com', '$2b$10$Ei655B/xgMYH09nOOcNvH.4vlCdBuO6aubZB4Rop.6DFyvYKSG29C', 2, NULL, NULL),
(57, 'juanesbetancur09@gmail.com', '$2a$10$.8M7.kZrYlMqgqyPmI/G2e4uhIqHU2yLAqRwTyq8KUqXn38gqQq02', 1, NULL, NULL),
(58, 'j@gmail.com', '$2a$10$sb7DQxYxPqX.Drw/jfqqou0mUaXVgNySlfHdO/KTq9s5mQMMO1.dW', 3, NULL, NULL),
(59, 'mathiwstw@gmail.com', '$2b$10$AVIdje/ETCR2tLCRcoEJ9urdDq8uGTkgxPWbSyZcp00G.f70KwWPW', 2, NULL, NULL),
(60, 'sas@gmail.com', '$2b$10$/2YS/u7o9v.ooajs97T0seqbHUDZsuxvXJ8sAZCtt8MezfMP5VtrG', 2, NULL, NULL),
(61, 'mathiwsts@gmail.com', '$2b$10$NEPtam2EKNZz4dsrAtgz9eSbgAcTMs/6MFLSydbYjUOFAG9/gVwBO', 1, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indices de la tabla `asistencias_estudiantes`
--
ALTER TABLE `asistencias_estudiantes`
  ADD KEY `id_asistencia` (`id_asistencia`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  ADD PRIMARY KEY (`id_catalogo`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `clases_estudiantes`
--
ALTER TABLE `clases_estudiantes`
  ADD PRIMARY KEY (`id_clase_estudianate`),
  ADD KEY `id_clase` (`id_clase`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`);

--
-- Indices de la tabla `cursos_instructores`
--
ALTER TABLE `cursos_instructores`
  ADD PRIMARY KEY (`id_curso_instructor`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `datos_usuarios`
--
ALTER TABLE `datos_usuarios`
  ADD PRIMARY KEY (`id_datos_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id_documento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`);

--
-- Indices de la tabla `permisos_rol`
--
ALTER TABLE `permisos_rol`
  ADD PRIMARY KEY (`id_permiso_rol`),
  ADD KEY `id_permiso` (`id_permiso`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  MODIFY `id_catalogo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `clases`
--
ALTER TABLE `clases`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `clases_estudiantes`
--
ALTER TABLE `clases_estudiantes`
  MODIFY `id_clase_estudianate` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `cursos_instructores`
--
ALTER TABLE `cursos_instructores`
  MODIFY `id_curso_instructor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `datos_usuarios`
--
ALTER TABLE `datos_usuarios`
  MODIFY `id_datos_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id_documento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `permisos_rol`
--
ALTER TABLE `permisos_rol`
  MODIFY `id_permiso_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=472;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`);

--
-- Filtros para la tabla `asistencias_estudiantes`
--
ALTER TABLE `asistencias_estudiantes`
  ADD CONSTRAINT `asistencias_estudiantes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `asistencias_estudiantes_ibfk_2` FOREIGN KEY (`id_asistencia`) REFERENCES `asistencias` (`id_asistencia`);

--
-- Filtros para la tabla `catalogo`
--
ALTER TABLE `catalogo`
  ADD CONSTRAINT `catalogo_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`);

--
-- Filtros para la tabla `clases`
--
ALTER TABLE `clases`
  ADD CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  ADD CONSTRAINT `clases_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `clases_estudiantes`
--
ALTER TABLE `clases_estudiantes`
  ADD CONSTRAINT `clases_estudiantes_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`),
  ADD CONSTRAINT `clases_estudiantes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cursos_instructores`
--
ALTER TABLE `cursos_instructores`
  ADD CONSTRAINT `cursos_instructores_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  ADD CONSTRAINT `cursos_instructores_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `datos_usuarios`
--
ALTER TABLE `datos_usuarios`
  ADD CONSTRAINT `datos_usuarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`);

--
-- Filtros para la tabla `permisos_rol`
--
ALTER TABLE `permisos_rol`
  ADD CONSTRAINT `permisos_rol_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `permisos_rol_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
