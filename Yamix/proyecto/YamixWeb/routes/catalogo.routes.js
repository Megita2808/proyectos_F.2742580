const express = require('express');
const router = express.Router();

const multer = require('multer');
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');
const clases = require('../controller/clasesController');
const catalogoController = require('../controller/catalogoController.js');

router.use(attachUserPermissions);
const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });

router.get('/catalogoAdmin',verifyToken,restrictToPermiso('catalogo admin'),attachUserPermissions, catalogoController.getAll, clases.obtenerCursos, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('admin/catalogoAdmin', {
        cursos: res.locals.cursos,
        catalogo: res.locals.catalogo,  permisos: userPermissions 
    });
});


router.post('/add', upload.single('imagen_producto'), catalogoController.addProduct);




router.post('/actualizarProducto',upload.single('imagen_producto'), catalogoController.actualizarProducto);

// En tu archivo de rutas
router.delete('/eliminarProducto/:id', catalogoController.eliminar);



module.exports = router;