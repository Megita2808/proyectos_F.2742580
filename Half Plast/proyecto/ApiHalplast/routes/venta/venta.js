const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasVentas,
    guardarVenta,
    actualizarVenta,
    eliminarVenta,
    inhabilitarVenta,
    obtenerVentasPorUsuario,
    obtenerVentasPorUsuarioCorreo,
} = require('../../controllers/venta/ventaController');

router.get('/ventas', obtenerTodasLasVentas);

router.post('/ventas', guardarVenta);

router.put('/ventas/:id', actualizarVenta);

router.delete('/ventas/:id', eliminarVenta);

router.patch('/ventas/inhabilitar/:id', inhabilitarVenta);

router.get('/ventas/usuario/:usuarioId', obtenerVentasPorUsuario);

router.get('/ventas/usuario/correo/:correo', obtenerVentasPorUsuarioCorreo);

module.exports = router;
