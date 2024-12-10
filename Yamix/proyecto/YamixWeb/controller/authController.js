const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase, captchaResponse } = req.body;
    
    try {
        // Validar el token de reCAPTCHA
        const secretKey = "6Le2640qAAAAAKpKZX4LKCIHM_fQiaLAwjmlRXWr"; // Tu clave secreta reCAPTCHA
        const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

        // Verificar reCAPTCHA
        const recaptchaResponse = await fetch(recaptchaUrl, {
            method: 'POST'
        });
        
        if (!recaptchaResponse.ok) {
            console.error('Error al verificar el reCAPTCHA:', recaptchaResponse.statusText);
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Verificación reCAPTCHA fallida. Intenta nuevamente.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        const recaptchaResult = await recaptchaResponse.json();
        console.log('reCAPTCHA Response:', recaptchaResult); // Agrega esta línea para depurar

        if (!recaptchaResult.success) {
            console.log('Error en la verificación de reCAPTCHA:', recaptchaResult['error-codes']);
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Verificación reCAPTCHA fallida. Intenta nuevamente.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        // Validaciones de los campos
        if (!nombre || !apellido || !contraseña || !fecha_nacimiento || !id_clase) {
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        // Verificar el formato del correo
        if (!gmail.includes('@')) {
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "El correo es inválido",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        // Validar la contraseña
        if (!/^\d{6,}$/.test(contraseña)) {
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "La contraseña debe tener al menos 6 dígitos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        // Calcular la edad y registrar el usuario
        const today = new Date();
        const birthDate = new Date(fecha_nacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Registro del usuario a través de la API
        const userData = { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase };
        const apiResponse = await fetch(`${process.env.pathApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (apiResponse.ok) {
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: age < 18 ? "Advertencia" : "Éxito",
                alertMessage: age < 18 
                    ? "Eres menor de edad. Tu cuenta estará en espera hasta que un administrador apruebe tu solicitud."
                    : "Registro exitoso",
                alertIcon: age < 18 ? 'info' : 'success',
                showConfirmButton: age < 18,
                timer: age < 18 ? false : 2500,
                ruta: 'login',
                showGuideButton: age < 18
            });
        } else {
            const errorData = await apiResponse.json();
            return res.render('web/inscripcion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: errorData.message || "Error en el registro del usuario",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }
    } catch (error) {
        console.error('Error en el proceso de registro:', error);
        return res.render('web/inscripcion', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error del servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 2500,
            ruta: 'inscripcion',
            showGuideButton: false
        });
    }
};



exports.login = async (req, res) => {
    console.log("logueando")
    const { correo, contraseña } = req.body;

    try {
        const loginData = { correo, contraseña };

        // Solicitud a la API
        const apiResponse = await fetch(`${process.env.pathApi}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        const responseData = await apiResponse.json();

        if (apiResponse.ok) {
            const { token } = responseData;

            // Configuración de la cookie
            const cookieOptions = {
                expires: new Date(
                    Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);

            // Decodificar el token y determinar el rol
            const decodedToken = jwt.decode(token);
            const userRole = decodedToken.rol;

            let ruta = '';

            if (userRole === 'administrador') {
                ruta = '/dashboard';
            }else if (userRole === 'profesor'){
                ruta = '/asistenciaProfe'
            }else{
                ruta = '/'
            }

            
            // Responder al frontend con la ruta
            return res.status(apiResponse.status).json({ mensaje: 'Inicio de sesión exitoso', ruta });
        } else {
            // Responder con un mensaje de error
            return res.status(apiResponse.status).json({
                mensaje: responseData.mensaje || 'Credenciales incorrectas'
            });
        }
    } catch (error) {
        console.error('Error en el proceso de login:', error);

        // Responder con un error genérico
        return res.status(500).json({
            mensaje: 'Error en el servidor. Intenta más tarde.'
        });
    }
};

exports.enviarCodigo = async (req, res) => {
    
    const { email } = req.body;
    console.log(email)

    try {
        const response = await fetch(`${process.env.pathApi}/enviar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            return res.status(200).json({
                mensaje: 'Código enviado correctamente.',
                ruta: '/codigo'
            });
        } else {
            return res.status(response.status).json({
                mensaje: data.mensaje || 'Error al enviar el código. Por favor, inténtalo de nuevo.'
            });
        }
    } catch (error) {
        console.error('Error al enviar el código de recuperación:', error);

        return res.status(500).json({
            mensaje: 'Error en el servidor. Inténtalo más tarde.'
        });
    }
};


exports.verificarCodigo = async (req, res) => {
    try {
        const { codigo, nuevaContraseña } = req.body;

        // Solicitud a la API externa
        const response = await fetch(`${process.env.pathApi}/verificarCodigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, nuevaContraseña })
        });

        // Verificar si el contenido es JSON
        const contentType = response.headers.get('content-type');
        let result = {};

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            throw new Error('La respuesta de la API no es JSON.');
        }

        // Manejar respuesta de la API
        if (response.ok) {
            return res.status(200).json({
                mensaje: 'Cambio de contraseña exitoso.',
                ruta: '/login' // Redirección al login
            });
        } else {
            return res.status(response.status).json({
                mensaje: 'Código incorrecto.'
            });
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);

        // Respuesta en caso de error del servidor
        return res.status(500).json({
            mensaje: 'Hubo un problema con el servidor. Inténtalo más tarde.'
        });
    }
};




exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}