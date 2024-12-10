const express = require('express');
const router = express.Router();

const {
    validarRecaptcha,
} = require('../../controllers/seguridad/reCAPTCHA');

router.post('/ValidarReCaptcha', async (req, res) => {
    const { token } = req.body;

    try {
        const validacion = await validarRecaptcha(token);
        if (!validacion.success) {
            return res.status(400).send('Recaptcha verification fallida');
        }

        res.status(200).send('Recaptcha procesado');
    } catch (error) {
        console.error('Error al validar reCAPTCHA:', error);
        res.status(500).send('Error al validar reCAPTCHA');
    }
});

module.exports = router;
