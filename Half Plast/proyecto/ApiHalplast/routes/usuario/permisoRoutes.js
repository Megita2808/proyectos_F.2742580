const express = require('express');
const router = express.Router();
const {
    permisoGet,
    permisoPost,
    permisoPut,
    permisoActualizarEstado,
    permisoDelete
} = require('../../controllers/usuario/permisoController');

router.get('/permisos', permisoGet);

router.post('/permiso', permisoPost);

router.put('/permiso/:id_permiso', permisoPut);

router.put('/permiso/estado/:id_permiso', permisoActualizarEstado);

router.delete('/permiso/:id_permiso', permisoDelete);

module.exports = router; 
