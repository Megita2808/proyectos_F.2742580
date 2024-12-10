const express = require('express');
const router = express.Router();
const { attachUserPermissions } = require('../controller/middleware/permisosVista');

const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const cursos = require('../controller/cursosController'); 

router.use(attachUserPermissions);
router.get('/', async (req, res) => {
    try {
        // Ejecutar el controlador para obtener los datos
        const { dataRolEstado, permisos, clasesUsuario, clasesDisponibles } = await cursos.obtenerDatosParaVista(req);

        // Renderizar la vista con los datos separados
        res.render('web/index', {
            dataRolEstado: dataRolEstado,       // Datos del rol y estado del usuario
            permisos: permisos,                 // Permisos del usuario
            clasesUsuario: clasesUsuario,       // Clases específicas del usuario
            clasesDisponibles: clasesDisponibles // Todas las clases disponibles para el carrusel
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);

        // Renderizar la vista con valores predeterminados en caso de error
        res.render('web/index', {
            dataRolEstado: { id_rol: null, estado: 'error' }, // Datos por defecto
            permisos: [],                                      // Sin permisos
            clasesUsuario: [],                                 // Sin clases específicas del usuario
            clasesDisponibles: []                              // Sin clases disponibles
        });
    }
});

// Ruta para agregar a clase
router.post("/agregarAclase", cursos.agregarAclase);

// Ruta para eliminar de clase
router.post("/eliminarDeClase", cursos.eliminarDeClase);




router.get('/about', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/about',{
        permisos: userPermissions
    });
});
router.get('/contac', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/contac',{
        permisos: userPermissions
    });
});
router.get('/clases', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/clases',{
        permisos: userPermissions
    });
});

router.get('/calen', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/calen',{
        permisos: userPermissions
    });
});




router.get('/login', (req, res) => {
    res.render('web/login');
});


router.get('/eventos', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/eventos',{
        permisos: userPermissions
    });
});
router.get('/catalogo', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/catalogo',{
        permisos: userPermissions
    });
});


module.exports = router;