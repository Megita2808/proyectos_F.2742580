const express = require('express');
const curso = require('../controller/cursosController');
const upload = require('../config/multerConfig');
const router = express.Router();


router.get('/traer_cursos', curso.traer);
router.get('/traerParaCur', curso.traerParaCur);

router.post('/agregar_curso',upload.single('file'), curso.agregarCurso);

router.post('/actualizar_curso/:id',upload.single('file'), curso.actualizarCurso); 

router.delete('/eliminar_curso/:id', curso.eliminarCurso);

// Ruta para obtener el rol y el estado del usuario
router.get('/obtenerRolYEstado/:id_usuario', curso.obtenerRolYEstado);
// Ruta para agregar un estudiante a una clase
router.post('/agregarAclase', curso.agregarAclase);
// Ruta para eliminar el registro de un estudiante de una clase
router.post('/eliminarDeClase', curso.eliminarDeClase);

module.exports = router;
