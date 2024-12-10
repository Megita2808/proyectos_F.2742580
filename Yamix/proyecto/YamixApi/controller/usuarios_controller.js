const db = require('../database/conexion');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');



exports.updateDocumento = (req, res) => {
    const { id_documento } = req.params; // ID del documento a actualizar
    const { id_usuario } = req.body; // ID del usuario asociado al documento
    const ruta_archivo = req.file ? `/uploads/documents/${req.file.filename}` : null; // Nueva ruta del archivo si se sube uno

    const idDocumentoNum = parseInt(id_documento, 10);
    const idUsuarioNum = parseInt(id_usuario, 10);


    // Validar que los IDs sean números válidos
    if (isNaN(idDocumentoNum) || isNaN(idUsuarioNum)) {
        return res.status(400).json({ error: 'id_documento e id_usuario deben ser números válidos' });
    }

    // Obtener la ruta actual del documento
    const getFileQuery = 'SELECT ruta_archivo FROM documentos WHERE id_documento = ?';
    db.query(getFileQuery, [idDocumentoNum], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el documento' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        const currentFilePath = results[0]?.ruta_archivo;

        // Preparar la consulta de actualización
        let query = 'UPDATE documentos SET id_usuario = ?';
        let values = [idUsuarioNum];

        if (ruta_archivo) {
            query += ', ruta_archivo = ?';
            values.push(ruta_archivo);
        }

        query += ' WHERE id_documento = ?';
        values.push(idDocumentoNum);

        // Ejecutar la consulta de actualización
        db.query(query, values, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar el documento' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Documento no encontrado' });
            }

            // Si se subió un nuevo archivo, eliminar el archivo antiguo
            if (ruta_archivo && currentFilePath && currentFilePath !== ruta_archivo) {
                const currentFileFullPath = path.join(__dirname, '..', currentFilePath);

                fs.unlink(currentFileFullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo antiguo:', err);
                        // Optional: No detener el flujo por errores al eliminar
                    }
                });
            }

            res.status(200).json({ message: 'Documento actualizado correctamente' });
        });
    });
};




exports.deleteDocumento = (req, res) => {
    const { id_documento } = req.params;

    // Validar que id_documento sea un número válido
    if (isNaN(parseInt(id_documento))) {
        return res.status(400).json({ error: 'id_documento debe ser un número válido' });
    }

    // Primero, obtén la ruta del archivo del documento
    const getDocumentQuery = 'SELECT ruta_archivo FROM documentos WHERE id_documento = ?';
    db.query(getDocumentQuery, [parseInt(id_documento)], (error, results) => {
        if (error) {
            console.error('Error al obtener el documento:', error);
            return res.status(500).json({ error: 'Error al eliminar el documento' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        const ruta_archivo = results[0].ruta_archivo;

        // Construir la ruta correcta fuera del directorio 'controller'
        const filePath = path.join(__dirname, '..', ruta_archivo);

        // Elimina el documento de la base de datos
        const deleteQuery = 'DELETE FROM documentos WHERE id_documento = ?';
        db.query(deleteQuery, [parseInt(id_documento)], (error, results) => {
            if (error) {
                console.error('Error al eliminar el documento:', error);
                return res.status(500).json({ error: 'Error al eliminar el documento' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Documento no encontrado' });
            }

            // Elimina el archivo del sistema de archivos
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });

            res.status(200).json({ message: 'Documento eliminado correctamente' });
        });
    });
};



exports.addDocumento = (req, res) => {


    // Verificar si se subieron archivos
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se han subido documentos' });
    }
    const { id_usuario } = req.body;
    
    
    // Validar los campos requeridos
    if (!id_usuario) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud: id_usuario es obligatorio' });
    }

    // Validar que id_usuario sea un número
    if (isNaN(parseInt(id_usuario))) {
        return res.status(400).json({ error: 'id_usuario debe ser un número válido' });
    }

    // Recorrer los archivos subidos
    req.files.forEach(file => {
        const ruta_documento = `/uploads/documents/${file.filename}`;

        // Consulta SQL para insertar el documento en la base de datos
        const query = `
            INSERT INTO documentos (ruta_archivo, id_usuario)
            VALUES (?, ?)
        `;
        const values = [ruta_documento, parseInt(id_usuario)];

        // Ejecución de la consulta
        db.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al insertar el documento:', error);
                return res.status(500).json({ error: 'Error al añadir el documento' });
            }
        });
    });

    // Respuesta exitosa
    res.status(200).json({ message: 'Documentos añadidos correctamente' });
};


exports.addDocumentoPerfil = async (req, res) => {


    // Verificar si se subieron archivos
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se han subido documentos' });
    }

    // Obtener id_usuario del cuerpo de la solicitud
    let { id_usuario } = req.body;

    // Validar los campos requeridos
    if (!id_usuario) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud: id_usuario es obligatorio' });
    }

    // Asegurarse de que id_usuario sea un número único
    id_usuario = Array.isArray(id_usuario) ? id_usuario[0] : id_usuario;
    const usuarioId = parseInt(id_usuario);

    // Validar que id_usuario sea un número válido
    if (isNaN(usuarioId)) {
        return res.status(400).json({ error: 'id_usuario debe ser un número válido' });
    }

    // Recorrer los archivos subidos y guardarlos en la base de datos
    req.files.forEach(file => {
        const ruta_documento = `/uploads/documents/${file.filename}`;

        // Consulta SQL para insertar el documento en la base de datos
        const query = `
            INSERT INTO documentos (ruta_archivo, id_usuario)
            VALUES (?, ?)
        `;
        const values = [ruta_documento, usuarioId];

        // Ejecución de la consulta
        db.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al insertar el documento:', error);
                return res.status(500).json({ error: 'Error al añadir el documento' });
            }
        });
    });

    // Validar la cantidad de archivos subidos por el usuario
    const queryCount = `SELECT COUNT(*) AS num_documentos FROM documentos WHERE id_usuario = ?`;
    db.query(queryCount, [usuarioId], async (error, results) => {
        if (error) {
            console.error('Error al contar los documentos:', error);
            return res.status(500).json({ error: 'Error al contar los documentos del usuario' });
        }
    
        const numDocumentos = results[0].num_documentos;

        // Si el usuario tiene 2 o más documentos, enviar un correo a los admins
        if (numDocumentos >= 2) {
            // Obtener el correo del usuario que subió los documentos
            const queryUser = `
    SELECT u.correo, du.nombre, du.apellido 
    FROM usuarios u
    JOIN datos_usuarios du ON u.id_usuario = du.id_usuario
    WHERE u.id_usuario = ?`;
    db.query(queryUser, [usuarioId], async (error, results) => {
        if (error) {
            console.error('Error al obtener el correo y nombre del usuario:', error);
            return res.status(500).json({ error: 'Error al obtener el correo y nombre del usuario' });
        }
    
        const correoUsuario = results[0].correo;
        const nombreUsuario = `${results[0].nombre} ${results[0].apellido}`;
    
        // Obtener los correos de los usuarios con rol 'admin'
        const queryAdmins = `SELECT correo FROM usuarios WHERE id_rol = (SELECT id_rol FROM roles WHERE nombre_rol = 'administrador')`;
        db.query(queryAdmins, [], async (error, adminsResults) => {
            if (error) {
                console.error('Error al obtener los correos de los administradores:', error);
                return res.status(500).json({ error: 'Error al obtener los correos de los administradores' });
            }
    
            const adminEmails = adminsResults.map(admin => admin.correo);
    
            // Leer la plantilla del correo de bienvenida
            let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/documentos.html'), 'utf8');
            htmlTemplate = htmlTemplate.replace('{{nombre}}', nombreUsuario);
            htmlTemplate = htmlTemplate.replace('{{correoUsuario}}', correoUsuario); // Incluir el correo del usuario
    
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
                to: adminEmails.join(', '), // Enviar el correo a todos los administradores
                subject: '¡Nuevos Documentos Subidos!',
                html: htmlTemplate
            };
    
            // Enviar el correo
            try {
                await transporter.sendMail(mailOptions);
                console.log('Correo enviado con éxito a los administradores');
            } catch (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ message: 'Error al enviar el correo a los administradores.' });
            }
        });
    });
        }

        // Respuesta exitosa
        res.status(200).json({ message: 'Documentos añadidos correctamente' });
    });
};


// Crear Usuario
exports.agregarUsuario = (req, res) => {
    const { nombre, apellido, fecha_nacimiento, correo, id_rol, estado, contraseña } = req.body;

    // Validar y transformar los datos si es necesario
    // Convertir a booleano


    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).json({ error: 'Error al obtener la conexión a la base de datos' });
        }

        const hashedPassword = bcrypt.hashSync(contraseña, 10); // Hashear la contraseña

        // Iniciar una transacción
        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error al iniciar la transacción:', err);
                return res.status(500).json({ error: 'Error al iniciar la transacción' });
            }

            const queryUsuario = 'INSERT INTO usuarios (correo, contraseña, id_rol) VALUES (?, ?, ?)';
            connection.query(queryUsuario, [correo, hashedPassword, id_rol], (err, resultsUsuario) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Error al agregar el usuario:', err);
                        res.status(500).json({ error: 'Error al agregar el usuario' });
                    });
                }

                const idUsuario = resultsUsuario.insertId;
                const queryDatosUsuario = `
                    INSERT INTO datos_usuarios 
                    (id_usuario, nombre, apellido, fecha_nacimiento, estado) 
                    VALUES (?, ?, ?, ?, ?)`;

                connection.query(queryDatosUsuario, [idUsuario, nombre, apellido, fecha_nacimiento, estado], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Error al agregar datos del usuario:', err);
                            res.status(500).json({ error: 'Error al agregar datos del usuario' });
                        });
                    }

                    // Confirmar la transacción
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Error al confirmar la transacción:', err);
                                res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }

                        // Liberar la conexión después de completar la transacción
                        connection.release();

                        // Enviar respuesta exitosa
                        res.status(201).json({
                            id_usuario: idUsuario,
                            correo,
                            nombre,
                            apellido,
                            fecha_nacimiento,
                            id_rol,
                            estado
                        });
                    });
                });
            });
        });
    });
};

// Verificar si el correo ya existe
exports.verificarCorreo = (req, res) => {
    const { correo } = req.body;

    // Realiza la consulta
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (error, results) => {
        if (error) {
            // Manejo de error
            return res.status(500).json({ mensaje: 'Error al verificar el correo', error });
        }

        // Devuelve si el correo existe
        res.json({ existe: results.length > 0 });
    });
};

// Verificar si el correo ya existe
exports.verificarCorreoEditar = (req, res) => {
    const { correo, id_usuario } = req.body;

    // Realiza la consulta para excluir el correo del usuario que se está editando
    db.query('SELECT * FROM usuarios WHERE correo = ? AND id_usuario != ?', [correo, id_usuario], (error, results) => {
        if (error) {
            // Manejo de error
            return res.status(500).json({ mensaje: 'Error al verificar el correo', error });
        }

        // Devuelve si el correo existe
        res.json({ existe: results.length > 0 });
    });
};


exports.traer = async (req, res) => {
    const query = `
        SELECT 
            u.id_usuario,
            u.correo,
            u.id_rol,
            r.nombre_rol,
            d.nombre,
            d.apellido,
            DATE_FORMAT(d.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
            d.estado,
            doc.id_documento,
            doc.ruta_archivo
        FROM 
            usuarios u
        LEFT JOIN 
            datos_usuarios d ON u.id_usuario = d.id_usuario
        LEFT JOIN 
            roles r ON u.id_rol = r.id_rol
        LEFT JOIN 
            documentos doc ON u.id_usuario = doc.id_usuario
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
        }

        // Transformar los resultados para agrupar documentos
        const usuarios = results.reduce((acc, row) => {
            const usuario = acc.find(u => u.id_usuario === row.id_usuario);
            const documento = {
                id_documento: row.id_documento,
                ruta_archivo: row.ruta_archivo
            };

            if (usuario) {
                // Agregar documento al usuario existente
                usuario.documentos.push(documento);
            } else {
                // Crear nuevo usuario con documentos
                acc.push({
                    id_usuario: row.id_usuario,
                    correo: row.correo,
                    id_rol: row.id_rol,
                    nombre_rol: row.nombre_rol,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    fecha_nacimiento: row.fecha_nacimiento,
                    estado: row.estado,
                    documentos: row.id_documento ? [documento] : []
                });
            }
            return acc;
        }, []);

        res.status(200).json(usuarios);
    });
};




// Obtener un usuario específico
exports.obtenerUsuario = async (req, res) => {
    const usuarioId = req.params.id;

    const query = `
        SELECT 
            u.id_usuario,
            u.correo,
            u.id_rol,
            r.nombre_rol,
            d.nombre,
            d.apellido,
            DATE_FORMAT(d.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
            d.estado
        FROM 
            usuarios u
        LEFT JOIN 
            datos_usuarios d ON u.id_usuario = d.id_usuario
        LEFT JOIN 
            roles r ON u.id_rol = r.id_rol
        WHERE 
            u.id_usuario = ?;
    `;

    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuario', details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};



// Leer un usuario específico
exports.traer_id = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM estudiantes WHERE id_usuario = ?';
    db.query(query, [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

// Editar Usuario
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, correo, estado, id_rol } = req.body;

    if (!nombre || !apellido || !fecha_nacimiento || !correo || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.getConnection(async (err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error al obtener la conexión a la base de datos' });
        }

        try {
            // Obtener el estado anterior del usuario
            const queryEstadoAnterior = 'SELECT estado FROM datos_usuarios WHERE id_usuario = ?';
            const [rows] = await connection.promise().query(queryEstadoAnterior, [id]);
            const estadoAnterior = rows[0]?.estado;

            // Si el rol es 2 (profesor) y el estado va a cambiar a "deshabilitado", verificar clases asignadas
            if (id_rol == 2 && estado === 'deshabilitado') {
                const queryClases = `
                    SELECT c.hora_inicio, c.hora_final, cu.nombre_curso
                    FROM clases c
                    INNER JOIN cursos cu ON c.id_curso = cu.id_curso
                    WHERE c.id_usuario = ? AND c.estado = 'activo'
                `;
                const [clases] = await connection.promise().query(queryClases, [id]);

                // Si hay clases asignadas, no permitir el cambio de estado
                if (clases.length > 0) {
                    // Función para formatear las horas
                    const formatTime = (time) => {
                        const [hours, minutes] = time.split(':').map(Number); // Separar horas y minutos
                        const period = hours >= 12 ? 'p.m' : 'a.m';
                        const formattedHours = hours % 12 || 12; // Convertir a formato 12 horas
                        return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                    };

                    const clasesDetalles = clases.map(
                        clase => `${clase.nombre_curso} de ${formatTime(clase.hora_inicio)} a ${formatTime(clase.hora_final)}`
                    ).join(', ');

                    return res.status(400).json({
                        error: `El profesor no puede ser deshabilitado porque ya tiene asignadas las clases: ${clasesDetalles}. Por favor, sácalo de estas clases primero.`
                    });
                }
            }


            connection.beginTransaction();

            // Actualizar tablas
            const queryUsuario = 'UPDATE usuarios SET correo = ?, id_rol = ? WHERE id_usuario = ?';
            await connection.promise().query(queryUsuario, [correo, id_rol, id]);

            const queryDatosUsuario = `
                UPDATE datos_usuarios 
                SET nombre = ?, apellido = ?, fecha_nacimiento = ?, estado = ? 
                WHERE id_usuario = ?
            `;
            await connection.promise().query(queryDatosUsuario, [nombre, apellido, fecha_nacimiento, estado, id]);

            // Enviar correo si cumple las condiciones
            if (id_rol == 4 && estado === 'habilitado' && estadoAnterior === 'espera') {
                console.log('Condiciones para enviar el correo cumplidas.');

                // Leer la plantilla HTML
                let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/habilitado.html'), 'utf8');
                htmlTemplate = htmlTemplate.replace('{{nombre}}', nombre);

                // Configurar Nodemailer
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
                    subject: '¡Tu cuenta ha sido habilitada!',
                    html: htmlTemplate
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Correo de habilitación enviado con éxito');
                } catch (error) {
                    console.error('Error al enviar el correo de habilitación:', error);
                    throw new Error('Error al enviar el correo de habilitación');
                }
            } else {
                console.log('No se cumplen las condiciones para enviar el correo.');
                console.log(`Estado anterior: ${estadoAnterior}, Estado: ${estado}, Rol: ${id_rol}`);
            }

            connection.commit();
            res.status(200).json({ message: 'Usuario editado exitosamente' });
        } catch (error) {
            console.error('Error en la transacción:', error);
            connection.rollback();
            res.status(500).json({ error: 'Error al editar usuario', details: error.message });
        } finally {
            connection.release();
        }
    });
};

// Actualizar Usuario
exports.actualizarUsuario = async (req, res) => {

    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, gmail, id_clase, contraseña, id_rol, estado } = req.body;

    // Validar ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    let hashedPassword = null;
    if (contraseña) {
        try {
            hashedPassword = await bcrypt.hash(contraseña, 10);
        } catch (err) {
            console.error('Error al encriptar la contraseña:', err.message);
            return res.status(500).json({ error: 'Error al encriptar la contraseña' });
        }
    }

    const query = `
        UPDATE usuarios 
        SET nombre = ?, apellido = ?, fecha_nacimiento = ?, gmail = ?, id_clase = ?,
            id_rol = ?, estado = ? ${contraseña ? ', contraseña = ?' : ''}
        WHERE id_usuario = ?
    `;

    // Preparar los valores para la consulta
    const values = [nombre, apellido, fecha_nacimiento, gmail, id_clase, id_rol, estado];
    if (hashedPassword) {
        values.push(hashedPassword);
    }
    values.push(id); // ID del usuario al final

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            return res.status(500).json({ error: 'Error al actualizar usuario', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({
            id_usuario: id,
            nombre,
            apellido,
            fecha_nacimiento,
            gmail,
            id_clase,
            id_rol,
            estado
        });
    });
};

// Eliminar Usuario
exports.eliminar = async (req, res) => {
    const { id } = req.params;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la conexión a la base de datos' });
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release(); // Liberar conexión en caso de error
                return res.status(500).json({ error: 'Error al iniciar la transacción' });
            }

            const queryDatosUsuario = 'DELETE FROM datos_usuarios WHERE id_usuario = ?';
            connection.query(queryDatosUsuario, [id], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release(); // Liberar conexión
                        res.status(500).json({ error: 'Error al eliminar los datos del usuario', details: err.message });
                    });
                }

                const queryUsuario = 'DELETE FROM usuarios WHERE id_usuario = ?';
                connection.query(queryUsuario, [id], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar conexión
                            res.status(500).json({ error: 'Error al eliminar usuario', details: err.message });
                        });
                    }

                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release(); // Liberar conexión
                                res.status(500).json({ error: 'Error al finalizar la transacción' });
                            });
                        }
                        connection.release(); // Liberar conexión después de la transacción exitosa
                        res.status(204).send(); // No Content
                    });
                });
            });
        });
    });
};



// Traer Usuarios en espera
exports.traerEspera = async (req, res) => {
    const query = `
        SELECT 
            u.id_usuario,
            u.correo,
            u.id_rol,
            r.nombre_rol,
            d.nombre,
            d.apellido,
            DATE_FORMAT(d.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
            d.estado
        FROM 
            usuarios u
        LEFT JOIN 
            datos_usuarios d ON u.id_usuario = d.id_usuario
        LEFT JOIN 
            roles r ON u.id_rol = r.id_rol
        WHERE 
            d.estado = 'espera';
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
        }
        res.status(200).json(results);
    });
};
exports.traerClasesU = async (req, res) => {
    const query = `
        SELECT 
            cl.id_clase,
            c.nombre_curso,  
            COUNT(ce.id_usuario) AS cantidad_estudiantes
        FROM 
            clases cl
        LEFT JOIN 
            clases_estudiantes ce ON cl.id_clase = ce.id_clase
        JOIN
            cursos c ON cl.id_curso = c.id_curso 
        GROUP BY 
            cl.id_clase, c.nombre_curso;
    `;

    try {
        const results = await db.promise().query(query);
     
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error en la consulta:', err); // Log del error
        res.status(500).json({ error: 'Error al obtener la información de clases', details: err.message });
    }
};


exports.obtenerUsuarioCompletoPorId = (req, res) => {

    const { id_usuario } = req.params;

    // Validación básica
    if (!id_usuario) {
        return res.status(400).json({
            mensaje: "El ID del usuario es obligatorio.",
        });
    }

    const query = `
    SELECT 
        u.id_usuario, 
        u.correo, 
        r.nombre_rol, 
        du.nombre, 
        du.apellido, 
        du.fecha_nacimiento,
        d.id_documento,
        d.ruta_archivo
    FROM usuarios u
    INNER JOIN datos_usuarios du ON u.id_usuario = du.id_usuario
    INNER JOIN roles r ON u.id_rol = r.id_rol
    LEFT JOIN documentos d ON u.id_usuario = d.id_usuario  -- LEFT JOIN para obtener todos los documentos
    WHERE u.id_usuario = ?
`;

    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener el usuario completo:', err);
            return res.status(500).json({
                mensaje: "Hubo un error al obtener la información del usuario.",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontró un usuario con el ID proporcionado.",
            });
        }

        // Estructura para el usuario
        const user = {
            id_usuario: results[0].id_usuario,
            correo: results[0].correo,
            nombre_rol: results[0].nombre_rol,
            nombre: results[0].nombre,
            apellido: results[0].apellido,
            fecha_nacimiento: results[0].fecha_nacimiento,
            documentos: []  // Este array contendrá todos los documentos
        };

        // Iteramos sobre los resultados para agregar los documentos al array
        results.forEach(row => {
            if (row.id_documento) {
                // Usamos req.protocol y req.get('host') para construir la URL completa
                const documentoUrl = `${req.protocol}://${req.get('host')}${row.ruta_archivo}`;

                // Agregamos el documento al array con la URL completa
                user.documentos.push({
                    id_documento: row.id_documento,
                    ruta_archivo: documentoUrl  // Aquí se coloca la URL completa
                });
            }
        });

        // Devolver la información completa del usuario, incluyendo el nombre del rol y los documentos
        res.status(200).json(user);
    });
};


exports.actualizarUsuarioPerfil = async (req, res) => {
    const { id_usuario } = req.params; // Acceder correctamente al id_usuario
    const { nombre, apellido, correo, fecha_nacimiento } = req.body;
  
    if (!id_usuario || !nombre || !apellido || !fecha_nacimiento) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    try {
      // Actualizamos solo los datos del usuario en la tabla 'datos_usuario'
      const [result] = await db.promise().query(
        'UPDATE datos_usuarios SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id_usuario = ?',
        [nombre, apellido, fecha_nacimiento, id_usuario]
      );
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado en datos_usuario' });
      }
  
      // Verificar si se desea actualizar el correo
      if (correo) {
        // Comprobar si el correo nuevo ya existe en la base de datos, excepto para el correo actual
        const [existingEmail] = await db.promise().query(
          'SELECT * FROM usuarios WHERE correo = ? AND id_usuario != ?',
          [correo, id_usuario]
        );
  
        if (existingEmail.length > 0) {
          return res.status(401).json({ error: 'El correo ya está registrado en otro usuario' });
        }
  
        // Si el correo no existe, se actualiza en la tabla 'usuarios'
        const [usuarioResult] = await db.promise().query(
          'UPDATE usuarios SET correo = ? WHERE id_usuario = ?',
          [correo, id_usuario]
        );
  
        // Verificar si se actualizó algún registro en la tabla 'usuarios'
        if (usuarioResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado en usuarios' });
        }
      }
  
      return res.status(200).json({ message: 'Usuario actualizado correctamente' });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  };


  exports.obtenerConteoInasistencias = async (req, res) => {
    const { id } = req.params;

    try {
        // Realizamos la consulta usando la promesa
        const [rows] = await db.promise().query(
            `SELECT COUNT(*) AS inasistencias
             FROM asistencias_estudiantes
             WHERE id_usuario = ? AND presente = 0`,
            [id]
        );

        // Comprobamos si tenemos datos en el resultado
        if (rows && rows.length > 0 && rows[0].inasistencias !== undefined) {
            const inasistencias = rows[0].inasistencias;
            res.json({ inasistencias });
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado o sin inasistencias registradas' });
        }
    } catch (error) {
        console.error('Error al obtener las inasistencias:', error);
        res.status(500).json({ message: 'Error al obtener las inasistencias' });
    }
};