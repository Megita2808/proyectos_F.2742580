const express = require('express');
const router = express.Router();
const {
    proveedoresGet,
    proveedorUnicoGet,
    proveedorPost,
    proveedorPut,
    proveedorDelete,
    proveedorActualizarEstado,
} = require('../../controllers/compra/proveedorController');

router.get('/proveedor', proveedoresGet);

router.get('/proveedor/:id', proveedorUnicoGet);

router.post('/proveedor', proveedorPost);

router.put('/proveedor/:id', proveedorPut);

router.put('/proveedor/estado/:id', proveedorActualizarEstado);

router.delete('/proveedor/:id', proveedorDelete);

module.exports = router; 
