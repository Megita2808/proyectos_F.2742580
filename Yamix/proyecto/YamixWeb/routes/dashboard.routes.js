const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');
router.use(attachUserPermissions);

router.get('/dashboard',verifyToken, restrictToPermiso('dashboard'),attachUserPermissions,(req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];{
    }
    res.render('admin/dashboard',  {permisos: userPermissions} );
});

module.exports = router;