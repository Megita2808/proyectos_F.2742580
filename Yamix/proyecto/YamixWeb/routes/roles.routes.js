const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');
router.use(attachUserPermissions);

const roles = require('../controller/roles_controller');


// Controlador traer roles
router.get('/permisos',verifyToken,restrictToPermiso('permisos'), attachUserPermissions, roles.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];

    res.render('./admin/permisos', { data: res.locals.data,  permisos: userPermissions  });
});

// Ruta para agregar rol
router.post('/agregar_rol',  roles.agregarRol);

// Ruta para editar rol
router.put('/editar_rol/:id_rol', roles.editarRol);

// Ruta para eliminar rol
router.delete('/eliminar_rol/:id_rol', roles.eliminarRol);


// Ruta para obtener todos los permisos
router.get('/todos_permisos',  roles.traerPermisos, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/permisos_rol/:rolId',  roles.traerPermisosPorRol, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para actualizar permisos de un rol
router.post('/actualizar_permisos', roles.actualizarPermisosPorRol);


module.exports = router;
