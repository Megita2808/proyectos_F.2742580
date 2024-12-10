const express = require('express');
const router = express.Router();
const {
    enviosModificarEstadoPost,
    obtenerEstadoEnvio
} = require('../../controllers/envio/cambiarEstadoController');

router.post('/cambiarEstado/General', enviosModificarEstadoPost);

router.post('/obtenerEstado/unicoDocumento', obtenerEstadoEnvio);

module.exports = router; 
