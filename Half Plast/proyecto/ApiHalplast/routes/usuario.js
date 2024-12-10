const express = require('express');
const router = express.Router();
const {
  usuarioGet,
  usuarioGetRol,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
  confirmarPassword,
  recuperarPassword,
  restablecerPassword,
  usuarioUnico,
  obtenerRolUsuarioApi,
  UsuariroActualizarEstado,
} = require('../controllers/usuario');

router.get('/usuarios', usuarioGet);

router.get('/usuarios/rol/:nombreRolEntrada', usuarioGetRol);

router.get('/usuarios/:id_usuario', usuarioUnico);

router.get('/usuario/rol/:correo', obtenerRolUsuarioApi);

router.post('/usuarios', usuarioPost);

router.post('/usuarios/confirmarPassword', confirmarPassword);

router.post('/usuarios/recuperarPassword', recuperarPassword);

router.post('/usuarios/restablecerPassword', restablecerPassword);

router.put('/usuarios/:id_usuario', usuarioPut);

router.put('/usuarios/estado/:id_usuario', UsuariroActualizarEstado);

router.delete('/usuarios/:id_usuario', usuarioDelete);

module.exports = router; 
