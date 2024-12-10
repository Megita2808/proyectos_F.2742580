const express = require('express');
const router = express.Router();
const {
    categoriasGet,
    categoriaUnicaGet,
    categoriaPost,
    categoriaPut,
    categoriaDelete,
    categoriaActualizarEstado,
} = require('../../controllers/catalogo/categoria/Categoria');

router.get('/categoria', categoriasGet);

router.get('/categoria/:id_Categoria', categoriaUnicaGet);

router.post('/categoria', categoriaPost);

router.put('/categoria/:id_Categoria', categoriaPut);

router.put('/categoria/estado/:id_Categoria', categoriaActualizarEstado);

router.delete('/categoria/:id_Categoria', categoriaDelete);

module.exports = router; 
