const express = require('express');
const clases = require('../controller/clasesController'); // Asegúrate de ajustar la ruta al controlador
const router = express.Router();

// Obtener todas las clases
router.get('/traer_clases', clases.traer);

// Agregar una nueva clase
router.post('/agregar_clase', clases.agregarClase);

// Actualizar una clase
router.post('/actualizar_clase/:id', clases.actualizarClase);

// Eliminar una clase
router.delete('/eliminar_clase/:id', clases.eliminarClase);

router.get('/obtener_profesores', clases.obtenerProfesores);
router.get('/obtener_cursos', clases.obtenerCursos);
router.get('/obtener_estudiantes', clases.traerEstudiantes)
router.get('/obtener_clases_estudiantes/:claseId', clases.obtenerEstudiantesPorClase)
router.post('/actualizar_estudiantes', clases.actualizarEstudiantes);


router.get('/traerPara', clases.traerPara)

router.get('/claseParaEstudiante/:id', clases.traerClasesPorEstudiante)

router.get('/clasePorUsuario/:id_usuario', clases.obtenerClasesPorUsuario)




module.exports = router;
