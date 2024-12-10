const express = require('express');
const router = express.Router();
const {
    ProductosGet,
    ProductosUnicoGet,
    ProductosPost,
    ProductosPut,
    ProductosDelete,
    ProductosActualizarEstado,
} = require('../../controllers/catalogo/producto/Producto');

router.get('/producto', ProductosGet);

router.get('/producto/:id_Producto', ProductosUnicoGet);

router.post('/producto', ProductosPost);

router.put('/producto/:id_Producto', ProductosPut);

router.put('/producto/estado/:id_Producto', ProductosActualizarEstado);

router.delete('/producto/:id_Producto', ProductosDelete);

module.exports = router; 