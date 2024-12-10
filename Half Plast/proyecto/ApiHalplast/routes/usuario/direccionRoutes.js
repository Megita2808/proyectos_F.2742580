const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosDepartamentos,
    obtenerLocacionesDeUsuarioOProveedor,
    guardarDireccion2,
    actualizarDireccion,
    inhabilitarDireccion,
    eliminarDireccion,
} = require('../../controllers/usuario/direccionesController');

router.get('/departamentos', obtenerTodosLosDepartamentos);

router.get('/direcciones/usuario/:usuarioCorreo', obtenerLocacionesDeUsuarioOProveedor);

router.post('/direcciones', guardarDireccion2);

router.put('/direcciones/:id', actualizarDireccion);

router.put('/direcciones/inhabilitar/:id', inhabilitarDireccion);

router.delete('/direcciones/:id', eliminarDireccion);

module.exports = router;
