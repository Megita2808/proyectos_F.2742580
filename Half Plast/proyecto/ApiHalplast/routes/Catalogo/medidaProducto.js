const express = require('express');
const router = express.Router();
const {
    MedidasProductoGet,
    MedidasProductoConMedidaVentaGet,
    MedidaProductoUnicoGet,
    MedidaProductoPost,
    MedidaProductoPut,
    MedidaProductoDelete,
    MedidaProductoActualizarEstado,
    MedidasProductoHabilitadosGet,
    CrearExistenciasMedidaProducto
} = require('../../controllers/catalogo/medidaProducto/MedidaProductoController');

router.get('/medidaProducto', MedidasProductoGet);

router.get('/medidaProducto/medidasVenta', MedidasProductoConMedidaVentaGet);

router.get('/medidaProducto/estadoHabilitado', MedidasProductoHabilitadosGet);

router.get('/medidaProducto/:id_MedidaProducto', MedidaProductoUnicoGet);

router.post('/medidaProducto', MedidaProductoPost);

router.put('/medidaProducto/:id_MedidaProducto', MedidaProductoPut);

router.put('/medidaProducto/estado/:id_MedidaProducto', MedidaProductoActualizarEstado);

router.delete('/medidaProducto/:id_MedidaProducto', MedidaProductoDelete);

module.exports = router; 
