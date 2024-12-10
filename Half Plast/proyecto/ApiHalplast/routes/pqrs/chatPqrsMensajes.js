const express = require('express');
const router = express.Router();
const {
    chatPqrsGet,
    chatPqrsPost,
    chatPqrsDelete,
    finalizarChat,
    chatPqrsPostCrear,
} = require('../../controllers/pqrs/ChatPqrs');

router.get('/chatPqrs/mensajes/:id_SistemaChat', chatPqrsGet);

router.post('/chatPqrs/mensajes/:id_SistemaChat', chatPqrsPost);
router.post('/chatPqrs/mensajes/crear/:id_SistemaChat', chatPqrsPostCrear);

router.delete('/chatPqrs/mensajes', chatPqrsDelete);
router.delete('/finalizarChat/mensajes', finalizarChat);

module.exports = router;