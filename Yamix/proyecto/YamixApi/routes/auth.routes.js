const express = require('express');
const router = express.Router();

const auth = require('../controller/authController')

router.post('/register', auth.register)
router.post('/login', auth.login)


router.post('/get_permissions', auth.get_permissions)

router.post('/verificar', auth.verificarPermisos);

router.post('/verify-captcha', auth.verifyCaptcha);
router.post('/enviar-codigo', auth.enviarCodigo)
router.post('/verificarCodigo', auth.restablecerContraseña);
router.get('/verificarEmail/:email', auth.checkEmail);

router.post('/verificar-correo', auth.verificarCorreo);

module.exports = router;