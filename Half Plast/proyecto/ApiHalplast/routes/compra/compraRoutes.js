const express = require('express');
const router = express.Router();
const {
    comprasGet,
    compraUnicaGet,
    compraPost,
    compraPut,
    compraDelete,
    compraActualizarEstado,
} = require('../../controllers/compra/compraController');

router.get('/compra', comprasGet);

router.get('/compra/:id', compraUnicaGet);

router.post('/compra', compraPost);

router.put('/compra/:id', compraPut);

router.put('/compra/estado/:id', compraActualizarEstado);

router.delete('/compra/:id', compraDelete);

module.exports = router; 
