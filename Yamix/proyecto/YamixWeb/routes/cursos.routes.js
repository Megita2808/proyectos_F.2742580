
const express = require('express');
const router = express.Router();

const cursos = require('../controller/cursosController'); 

const multer = require('multer');

const { attachUserPermissions } = require('../controller/middleware/permisosVista');
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');

const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });
router.use(attachUserPermissions);



// Rutas para los cursos


router.post('/agregar_curso',upload.single('file'), cursos.agregarCurso);

router.post('/actualizar_curso/:id', upload.single('file'), cursos.actualizarCurso);



router.delete('/eliminar_curso/:id', cursos.eliminarCurso);
router.get('/obtener_curso/:id_curso', cursos.obtenerCurso);
router.get('/traer_cursos', cursos.traerCursos);

router.get('/cursosAdmin',verifyToken, restrictToPermiso('cursos'),attachUserPermissions, cursos.traerCursos, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('admin/cursosAdmin',  { data: res.locals.data,  permisos: userPermissions });
});

module.exports = router;