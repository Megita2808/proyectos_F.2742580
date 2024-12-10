const express = require('express');
const router = express.Router();
const {
    MedidasVentaGet,
    MedidaVentaUnicoGet,
    MedidaVentaPost,
    MedidaVentaPut,
    MedidaVentaDelete,
    MedidaVentaActualizarEstado,
} = require('../../controllers/catalogo/medidaVenta/MedidaVentaController');

router.get('/medidaVenta', MedidasVentaGet);

router.get('/medidaVenta/:id_MedidaVenta', MedidaVentaUnicoGet);

router.post('/medidaVenta', MedidaVentaPost);

router.put('/medidaVenta/:id_MedidaVenta', MedidaVentaPut);

router.put('/medidaVenta/estado/:id_MedidaVenta', MedidaVentaActualizarEstado);

router.delete('/medidaVenta/:id_MedidaVenta', MedidaVentaDelete);

module.exports = router; 
