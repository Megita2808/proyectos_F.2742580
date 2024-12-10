const express = require('express');
const router = express.Router();
const {
  tipoPqrsGet,
  tipoPqrsPost,
  tipoPqrsPut,
  tipoPqrsDelete,
} = require('../../controllers/pqrs/tipoPqrs');

router.get('/tipoPqrs', tipoPqrsGet);

router.post('/tipoPqrs', tipoPqrsPost);

router.put('/tipoPqrs/:id_tipo', tipoPqrsPut);

router.delete('/tipoPqrs/:id_tipo', tipoPqrsDelete);

module.exports = router; 
