const express = require('express');
const router = express.Router();
const clases = require('../controller/clasesController');

const { attachUserPermissions } = require('../controller/middleware/permisosVista');
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
// Rutas de clases
router.post('/agregar_clase', clases.agregarClase);
router.put('/actualizar_clase/:id', clases.actualizarClase);
router.delete('/eliminar_clase/:id', clases.eliminarClase);
router.get('/traer_clases', clases.traerClases);
router.get('/obtener_clase/:id_clase', clases.obtenerClase);

// Ruta para el administrador de clases
router.get('/clasesAdmin', verifyToken, restrictToPermiso('clases'), attachUserPermissions,  
    clases.traerClases, 
    clases.obtenerProfesores, 
    clases.obtenerCursos, 
    (req, res) => {
        const userPermissions = req.usuario ? req.usuario.permisos : [];
        res.render('admin/clasesAdmin', { 
            data: res.locals.data,
            profesores: res.locals.profesores,
            cursos: res.locals.cursos,
            permisos: userPermissions 
        });
    }
);

// Ruta para obtener todos los estudiantes
router.get('/todos_estudiantes',  clases.traerEstudiantes, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/estudiantes_clases/:claseId',  clases.traerEstudiantesPorClase, (req, res) => {
    res.json(res.locals.data);
});

router.post('/actualizar_estudiantes', clases.actualizarEstudiantesPorClase);

router.get('traerPara', clases.traerPara);


module.exports = router;
