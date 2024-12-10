const express = require('express');
const router = express.Router();
const {
    rolGet,
    rolPost,
    rolPut,
    rolDelete,
    rolActualizarEstado,
} = require('../../controllers/usuario/rolController');

router.get('/roles', rolGet);

router.post('/rol', rolPost);

router.put('/rol/:id_rol', rolPut);

router.put('/rol/estado/:id_rol', rolActualizarEstado);

router.delete('/rol/:id_rol', rolDelete);


module.exports = router; 
