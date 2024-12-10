const express = require('express');
const router = express.Router();
const {
    pesosGet,
    pesoUnicoGet,
    pesoPost,
    pesoPut,
    pesoDelete,
    pesoActualizarEstado,
} = require('../../controllers/catalogo/peso/PesoController');

router.get('/peso', pesosGet);

router.get('/peso/:id_Peso', pesoUnicoGet);

router.post('/peso', pesoPost);

router.put('/peso/:id_Peso', pesoPut);

router.put('/peso/estado/:id_Peso', pesoActualizarEstado);

router.delete('/peso/:id_Peso', pesoDelete);

module.exports = router; 
