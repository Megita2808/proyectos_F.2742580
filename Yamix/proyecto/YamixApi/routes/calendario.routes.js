const express = require('express');
const eventos = require('../controller/calendarioController'); 
const router = express.Router();

router.get('/traer_eventos', eventos.traerEventos);
router.get('/traer_eventosU', eventos.traerEventosU);
router.get('/obtener_evento/:id', eventos.obtenerEvento);
router.post('/agregar_evento', eventos.agregarEvento);
router.post('/actualizar_evento/:id', eventos.actualizarEvento);
router.delete('/eliminar_evento/:id', eventos.eliminarEvento);
router.get('/traerEventosPorNombreClase/:nombre_clase', eventos.traerEventosPorNombreCurso); 
router.get('/obtener_cursoss', eventos.obtenerCursoss);
router.get('/cargarEventoParaActualizar' , eventos.cargarEventoParaActualizar)
module.exports = router;
