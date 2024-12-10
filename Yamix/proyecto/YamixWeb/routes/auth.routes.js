const express = require('express');
const router = express.Router();
const auth = require('../controller/authController')


router.get('/register', (req, res) => {
    res.render('web/inscripcion');
});
router.get('/recuperar', (req, res) => {
    res.render('web/recuperar');
});

router.get('/codigo', (req, res) => {
    res.render('web/codigo');
});



router.post('/registro', auth.register);
router.post('/logueo', auth.login);
router.get('/logout', auth.logout);
router.post('/enviar_codigo', auth.enviarCodigo)
router.post('/restablecer', auth.verificarCodigo)

module.exports = router;