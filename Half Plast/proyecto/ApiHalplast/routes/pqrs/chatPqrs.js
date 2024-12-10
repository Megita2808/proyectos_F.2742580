const express = require('express');
const router = express.Router();
const {
  sistemaChatPqrsGet,
  sistemaChatPqrsPut,
  sistemaChatPqrsDelete,
  agregarFechaChatPqrs,
  agregarEmpleadoChatPqrs,
  ultimoEstadoChatPqrs,
  SistemaChatPqrsGetUnico,

} = require('../../controllers/pqrs/sistemaChatPqrs');

router.get('/chatPqrs', sistemaChatPqrsGet);

router.get('/chatPqrs/estado/:id_ChatPqrs', ultimoEstadoChatPqrs);

router.get('/chatPqrs/unico/:id_Usuario', SistemaChatPqrsGetUnico);

router.post('/chatPqrs/agregarEstado/:id_ChatPqrs', agregarFechaChatPqrs);

router.post('/chatPqrs/agregarEmpleado/:id_ChatPqrs', agregarEmpleadoChatPqrs);

router.put('/chatPqrs/:id_ChatPqrs', sistemaChatPqrsPut);

router.delete('/chatPqrs/:id_ChatPqrs', sistemaChatPqrsDelete);

module.exports = router; 