const express = require('express');
const router = express.Router();
const {
    coloresGet,
    colorUnicoGet,
    colorPost,
    colorPut,
    colorDelete,
    colorActualizarEstado,
} = require('../../controllers/catalogo/color/ColorController');

router.get('/color', coloresGet);

router.get('/color/:id_Color', colorUnicoGet);

router.post('/color', colorPost);

router.put('/color/:id_Color', colorPut);

router.put('/color/estado/:id_Color', colorActualizarEstado);

router.delete('/color/:id_Color', colorDelete);

module.exports = router; 
