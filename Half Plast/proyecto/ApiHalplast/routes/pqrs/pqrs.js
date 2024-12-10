const express = require('express');
const router = express.Router();
const {
  pqrsGet,
  pqrsPost,
  pqrsPut,
  pqrsDelete,
} = require('../../controllers/pqrs/pqrs');

router.get('/pqrs', pqrsGet);

router.post('/pqrs', pqrsPost);

router.put('/pqrs/:id_pqrs', pqrsPut);

router.delete('/pqrs/:id_pqrs', pqrsDelete);

module.exports = router; 
