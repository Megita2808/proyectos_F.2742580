const axios = require('axios');

const validarRecaptcha = async (token) => {
    const secretKey = '6LfYLFAqAAAAAJ4OlkzVfZWJ1Q0mQBohB-MFcTLD';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        throw new Error('Error al verificar reCAPTCHA');
    }
};

module.exports = {
    validarRecaptcha,
};
