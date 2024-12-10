const express = require('express');
const router = express.Router();
const {
    CatalogoGet,
} = require('../../controllers/catalogo/catalogo/CatalogoController');

router.get('/catalogoCompleto', CatalogoGet);

module.exports = router; 
