const express = require('express');
const eventos = require('../controller/calendarioController'); 
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');
const router = express.Router();
router.use(attachUserPermissions);
// Rutas para manejar eventos
router.get('/traer_eventos', eventos.traerEventos);
router.get('/obtener_evento/:id', eventos.obtenerEventoPorId); 
router.post('/agregar_evento', eventos.agregarEvento);
router.post('/actualizar_evento/:id', eventos.actualizarEvento);
router.delete('/eliminar_evento/:id', eventos.eliminarEvento);
router.get('/traerEventosPorNombreClase/:nombre_clase', eventos.traerEventosPorNombreCurso); 


router.get('/calendarioAdmin',verifyToken,restrictToPermiso('calendario'),attachUserPermissions,
    eventos.obtenerCursoss, 
    (req, res) => {
        const userPermissions = req.usuario ? req.usuario.permisos : [];
        res.render('admin/calendarioAdmin', { 
            cursos: res.locals.cursoss,  permisos: userPermissions 
        });
    }
);




router.get('/cargar_evento/:id', eventos.cargarEventoParaActualizar);
  
module.exports = router;
