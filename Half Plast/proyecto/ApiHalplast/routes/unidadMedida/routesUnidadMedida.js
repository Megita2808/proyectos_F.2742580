const express = require('express');
const router = express.Router();
const {
    unidadesMedidaGet,
    unidadesMedidaPost,
    unidadesMedidaPut,
    unidadesMedidaDelete,
    unidadMedidaGetById,
    unidadesMedidaGetByTipo,
    MedidaProductoActualizarEstado
} = require('../../controllers/unidadMedida/unidadMedidaController');

router.get('/unidadMedida', unidadesMedidaGet);

router.get('/unidadMedida/unico/:id', unidadMedidaGetById);

router.get('/unidadMedida/tipo/:tipo', unidadesMedidaGetByTipo);

router.post('/unidadMedida', unidadesMedidaPost);

router.put('/unidadMedida/:id', unidadesMedidaPut);

router.put('/unidadMedida/estado/:id', MedidaProductoActualizarEstado);

router.delete('/unidadMedida/:id', unidadesMedidaDelete);

module.exports = router; 