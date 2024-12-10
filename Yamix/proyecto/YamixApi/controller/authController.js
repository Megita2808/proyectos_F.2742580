
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const conexion = require('../database/conexion');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios');



exports.verificarPermisos = async (req, res) => {
    const { rol, permisosRequeridos } = req.body;

    if (!rol || !permisosRequeridos) {
        return res.status(400).json({ message: 'Rol o permisos requeridos no proporcionados' });
    }
    
    const permisosRequeridosArray = Array.isArray(permisosRequeridos) 
        ? permisosRequeridos 
        : permisosRequeridos.split(',');

    const query = `
        SELECT p.nombre_permiso
        FROM permisos p
        JOIN permisos_rol rp ON p.id_permiso = rp.id_permiso
        JOIN roles r ON rp.id_rol = r.id_rol
        WHERE r.nombre_rol = ?
    `;

    conexion.query(query, [rol], (err, results) => {
        if (err) {
            console.error('Error al obtener los permisos del rol:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        const permisos = results.map(row => row.nombre_permiso);

        // Verificar si al menos uno de los permisos requeridos está en la lista de permisos
        const tienePermiso = permisosRequeridosArray.some(permiso => permisos.includes(permiso));

        if (!tienePermiso) {
            return res.status(403).json({ message: 'No tienes los permisos necesarios' });
        }

        res.status(200).json({ message: 'Permisos válidos' });
    });
};



exports.verificarCorreo = (req, res) => {
    const { correo } = req.body;

    // Verifica si el correo fue proporcionado
    if (!correo) {
        return res.status(400).json({
            success: false,
            message: 'El correo es obligatorio.'
        });
    }


    // Realiza la consulta a la base de datos
    conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (error, rows) => {
        if (error) {
            console.error('Error al verificar el correo:', error);
            return res.status(500).json({
                success: false,
                message: 'Error del servidor al verificar el correo.'
            });
        }

        // Si se encuentra un usuario con el correo
        if (rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'El correo existe en la base de datos.',
                usuario: rows[0] // Retorna el primer usuario encontrado (opcional)
            });
        }

        // Si no se encuentra el correo
        return res.status(404).json({
            success: false,
            message: 'El correo no existe en la base de datos.'
        });
    });
};

exports.verifyCaptcha = async (req, res) => {
    const { captchaResponse } = req.body;
    const secretKey = '6Le2640qAAAAAKpKZX4LKCIHM_fQiaLAwjmlRXWr'; 

    try {
        const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

        const captchaVerificationResponse = await axios.post(captchaVerificationUrl);
        const verificationData = captchaVerificationResponse.data;

        if (!verificationData.success) {
            return res.status(400).json({ success: false, message: 'Error de reCAPTCHA. Verifica que no eres un robot.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error al verificar el reCAPTCHA:', error);
        return res.status(500).json({ success: false, message: 'Error al verificar el reCAPTCHA.' });
    }
};



exports.register = async (req, res) => {
    const saltRounds = 10;
    const { nombre, apellido, correo, contraseña, fecha_nacimiento } = req.body;

    try {
        // Verificar si el correo electrónico ya existe en la base de datos
        const checkQuery = 'SELECT * FROM usuarios WHERE correo = ?';
        conexion.query(checkQuery, [correo], async (err, results) => {
            if (err) {
                console.error('Error al verificar el correo electrónico:', err);
                return res.status(500).json({ message: 'Error al verificar el correo electrónico', error: err });
            }

            if (results.length > 0) {
                // Si el correo ya existe, se retorna un error
                return res.status(400).json({ message: 'El correo ya está registrado.' });
            }

            // Si el correo no está registrado, encriptamos la contraseña
            const hashedPassword = await bcryptjs.hash(contraseña, saltRounds);
            const idRol = 4; // Suponiendo que el rol es 4 para nuevos usuarios
            const estado = 'espera'; // Estado por defecto de los nuevos usuarios

            // Insertar el usuario en la tabla 'usuarios'
            const insertQuery = 'INSERT INTO usuarios (correo, contraseña, id_rol) VALUES (?, ?, ?)';
            conexion.query(insertQuery, [correo, hashedPassword, idRol], (err, result) => {
                if (err) {
                    console.error('Error al insertar usuario en la base de datos:', err);
                    return res.status(500).json({ message: 'Error al registrar usuario', error: err });
                }

                const idUsuario = result.insertId;

                // Insertar los datos del usuario en la tabla 'datos_usuarios'
                const insertDatosUsuarioQuery = 'INSERT INTO datos_usuarios (id_usuario, nombre, apellido, fecha_nacimiento, estado) VALUES (?, ?, ?, ?, ?)';
                const documentacion = 0; // Asumimos que 'documentacion' es 0 por defecto

                conexion.query(insertDatosUsuarioQuery, [idUsuario, nombre, apellido, fecha_nacimiento, estado, documentacion], async (err) => {
                    if (err) {
                        console.error('Error al insertar datos del usuario:', err);
                        return res.status(500).json({ message: 'Error al registrar los datos del usuario', error: err });
                    }

                    // Leer la plantilla HTML de bienvenida y reemplazar el nombre del usuario
                    let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/bienvenidos.html'), 'utf8');
                    htmlTemplate = htmlTemplate.replace('{{nombre}}', nombre);

                    // Configurar el servicio de correo (Nodemailer)
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: correo,
                        subject: '¡Bienvenido a Nuestra Plataforma!',
                        html: htmlTemplate
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                        console.log('Correo de bienvenida enviado con éxito');
                    } catch (error) {
                        console.error('Error al enviar el correo:', error);
                        return res.status(500).json({ message: 'Error al enviar el correo de bienvenida.' });
                    }

                    // Responder con éxito si todo el proceso es correcto
                    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: idUsuario });
                });
            });
        });
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error });
    }
};


exports.login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        console.log(req.body);

        if (!correo || !contraseña) {
            return res.status(400).json({ message: 'Ingresa datos en los campos' });
        }

        // Verificar si el usuario existe y validar la contraseña
        conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.length === 0 || !(await bcryptjs.compare(contraseña, results[0].contraseña))) {
                return res.status(401).json({ message: 'La contraseña y/o el correo no coinciden' });
            }

            const user = results[0];

            // Consultar el estado, rol y clases desde datos_usuarios y clases_estudiantes
            const query = `
                SELECT du.estado, r.nombre_rol, ce.id_clase
                FROM datos_usuarios du
                JOIN usuarios u ON du.id_usuario = u.id_usuario
                JOIN roles r ON u.id_rol = r.id_rol
                LEFT JOIN clases_estudiantes ce ON du.id_usuario = ce.id_usuario
                WHERE du.id_usuario = ?
            `;

            conexion.query(query, [user.id_usuario], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                if (results.length === 0) {
                    return res.status(500).json({ message: 'No se encontraron datos adicionales del usuario' });
                }

                const userDetails = results[0];
                console.log('Detalles del usuario:', userDetails); // Debug
                // Verificar si el usuario está deshabilitado
                if (userDetails.estado === 'deshabilitado') {
                    return res.status(403).json({ message: 'El usuario está deshabilitado. Contacta al administrador.' });
                }

                // Si el estado es "espera", permitir login y enviar status 202
                if (userDetails.estado === 'espera') {
                    const rol = userDetails.nombre_rol;
                    const clases = results.map(row => row.id_clase);
                    
                    const token = jwt.sign(
                        { id: user.id_usuario, rol, clases },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES }
                    );
                    
                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    });
                
                    console.log('Estado espera detectado, enviando respuesta con código 202');
                    return res.status(202).json({
                        message: 'Login exitoso, pero la cuenta está en estado de espera.',
                        token
                    });
                }
                
                // Para otros estados, proceder normalmente
                const rol = userDetails.nombre_rol;
                const clases = results.map(row => row.id_clase);

                // Crear el token con id del usuario, rol y clases
                const token = jwt.sign(
                    { id: user.id_usuario, rol, clases },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES }
                );

                // Guardar el token en la cookie
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
                    httpOnly: true
                });

                return res.status(200).json({ message: 'Login exitoso', token });
            });
        });
    } catch (error) {
        console.log('Error en el proceso de login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};





exports.get_permissions = (req, res) => {
    const { id } = req.body;
    conexion.query(`
        SELECT p.nombre_permiso
        FROM permisos p
        INNER JOIN permisos_rol rp ON p.id_permiso = rp.id_permiso
        INNER JOIN usuarios u ON rp.id_rol = u.id_rol
        WHERE u.id_usuario = ?
    `, [id], (error, results) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Permisos no encontrados' });
        }

        // Convertir los resultados en un array de permisos
        const permisos = results.map(row => row.nombre_permiso);
        res.json({ permisos });
    });
};



exports.checkEmail = async (req, res) => {
    const {correo } = req.params;
    console.log('Email recibido:', req.params);

    try {
        // Realiza la consulta para verificar si el correo existe
        conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (error, results) => {
            if (error) {
                console.error('Error en la consulta a la base de datos:', error);
                return res.status(500).json({ message: 'Error del servidor.' });
            }


            if (results.length > 0) {
                res.status(200).json({ message: 'El correo existe.' });
            } else {
                res.status(404).json({ message: 'Correo no encontrado.' });
            }
        });
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};


exports.enviarCodigo = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Email recibido:', email);

        conexion.query('SELECT * FROM usuarios WHERE correo = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error al consultar el usuario:', err);
                return res.status(500).json({ message: 'Error al consultar el usuario.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'El correo no está registrado.' });
            }

            const usuario = results[0];
            const codigoRecuperacion = crypto.randomBytes(3).toString('hex');
            const codigoExpiracion = Date.now() + 3600000; // 1 hora
            console.log('Código de recuperación generado:', codigoRecuperacion);

            conexion.query('UPDATE usuarios SET codigoRecuperacion = ?, codigoExpiracion = ? WHERE id_usuario = ?',
                [codigoRecuperacion, codigoExpiracion, usuario.id_usuario], async (err) => {
                    if (err) {
                        console.error('Error al actualizar el código de recuperación:', err);
                        return res.status(500).json({ message: 'Error al actualizar el código de recuperación.' });
                    }

                    // Leer la plantilla HTML y reemplazar el código de recuperación
                    let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/plantillaCodigo.html'), 'utf8');
                    htmlTemplate = htmlTemplate.replace('{{codigoRecuperacion}}', codigoRecuperacion);

                    // Configuración de Nodemailer
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: usuario.correo,
                        subject: 'Código de Recuperación de Contraseña',
                        html: htmlTemplate // Enviar la plantilla HTML
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                        res.status(200).json({ message: 'Código de recuperación enviado.' });
                    } catch (error) {
                        console.error('Error al enviar el correo:', error);
                        res.status(500).json({ message: 'Error al enviar el código de recuperación.' });
                    }
                });
        });
    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({ message: 'Error al enviar el código de recuperación.' });
    }
};



exports.restablecerContraseña = async (req, res, next) => {
    console.log(req.body)
    const saltRounds = 10;
    try {
        const { codigo, nuevaContraseña } = req.body;

        if (!codigo || !nuevaContraseña) {
            return res.status(400).json({ message: 'El código y la nueva contraseña son requeridos.' });
        }

        // Verificar el código de recuperación
        conexion.query('SELECT * FROM usuarios WHERE codigoRecuperacion = ?', [codigo], async (error, results) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);
                return res.status(500).json({ message: 'Error en la base de datos.' });
            }

            if (results.length > 0) {
                const usuario = results[0];
                const codigoExpiracion = usuario.codigoExpiracion;

                if (Date.now() > codigoExpiracion) {
                    // Código ha expirado
                    return res.status(400).json({ message: 'El código ha expirado.' });
                }

                // Aquí puedes agregar la lógica para encriptar la nueva contraseña
                const contraseñaEncriptada = await bcryptjs.hash(nuevaContraseña, saltRounds);

                // Actualizar la contraseña en la base de datos
                conexion.query('UPDATE usuarios SET contraseña = ?, codigoRecuperacion = NULL, codigoExpiracion = NULL WHERE codigoRecuperacion = ?', [contraseñaEncriptada, codigo], (error) => {
                    if (error) {
                        console.error('Error al actualizar la contraseña:', error);
                        return res.status(500).json({ message: 'Error al actualizar la contraseña.' });
                    }

                    res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
                });
            } else {
                console.log("codigo incorrecto")
                res.status(400).json({ message: 'Código incorrecto.' });
            }
        });
    } catch (error) {
        console.error('Error en el restablecimiento de la contraseña:', error);
        res.status(500).json({ message: 'Error en el restablecimiento de la contraseña.' });
    }
};