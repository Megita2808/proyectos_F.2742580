const express = require('express');
const router = express.Router();
const {
  distribuidorGet,
  distribuidorPost,
  distribuidorPut,
  distribuidorPutEstado,
  distribuidorDelete,
  distribuidorUnico,
  getDistribuidoresByEstado,
} = require('../../controllers/distribuidor/distribuidorController');

router.get('/distribuidores', distribuidorGet);

router.get('/distribuidores/estado/:estado', getDistribuidoresByEstado);

router.get('/distribuidor/:id_distribuidor', distribuidorUnico);

router.post('/distribuidor', distribuidorPost);

router.put('/distribuidor/:id_distribuidor', distribuidorPut);

router.put('/distribuidor/estado/:id_distribuidor', distribuidorPutEstado);

router.delete('/distribuidor/:id_distribuidor', distribuidorDelete);

module.exports = router; 
