const express = require('express');
const router = express.Router();
const {
    precioVentaGet,
    precioVentaPost,
    precioVentaPut,
    precioVentaDelete,
    precioVentaGetById,
    precioVentaActualizarEstado
} = require('../../controllers/precioVenta/precioVentaController');

router.get('/precioVenta', precioVentaGet);

router.get('/precioVenta/unico/:id', precioVentaGetById);

router.post('/precioVenta', precioVentaPost);

router.put('/precioVenta/:id', precioVentaPut);

router.put('/precioVenta/estado/:id', precioVentaActualizarEstado);

router.delete('/precioVenta/:id', precioVentaDelete);

module.exports = router; 
