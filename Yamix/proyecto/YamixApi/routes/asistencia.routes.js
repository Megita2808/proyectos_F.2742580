const express = require('express');
const asistencia = require('../controller/asistenciaController'); // Asegúrate de ajustar la ruta al controlador
const router = express.Router();

// Asistencias por el lado de Dashboard Admin
router.get('/traer_asistencia', asistencia.traerAsistencias);
router.post('/crear_asistencia', asistencia.crearAsistencia)
router.get('/obtenerAsistenciasUsuario/:id_usuario', asistencia.asistenciasPorUsuario);
router.get('/obtenerUnaAsistencias/:id_asistencia', asistencia.asistenciaPorId);
router.get('/claseEstudiante/:id_clase', asistencia.obtenerEstudiantesPorClase);
router.get('/estudiantesPorAsistencia/:id_asistencia', asistencia.estudiantesPorAsistencia);
router.put('/actualizar_asistencia_estudiantes', asistencia.actualizarAsistenciaEstudiantes);
router.put('/actualizar_asistencia/:id_asistencia', asistencia.actualizarFechaAsistencia);

// Asistencias por el lado del Profesor
router.get('/traerAsistenciaProfe/:id_usuario', asistencia.traerAsistenciaProfe);


router.get('/assistances/:id_usuario', asistencia.getUserAssistances);


module.exports = router;