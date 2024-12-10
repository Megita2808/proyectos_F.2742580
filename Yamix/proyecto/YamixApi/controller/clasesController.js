const db = require('../database/conexion');
const moment = require('moment-timezone');


exports.obtenerClasesPorUsuario = (req, res) => {
    const idUsuario = req.params.id_usuario; // Se asume que el id_usuario se pasa como parámetro en la URL

    const query = `
    SELECT c.id_clase, cu.nombre_curso, c.hora_inicio, c.hora_final, c.id_usuario, c.estado
    FROM clases c
    INNER JOIN cursos cu ON c.id_curso = cu.id_curso
    WHERE c.id_usuario = ?
    ORDER BY c.id_clase DESC
`;

    // Ejecutar la consulta
    db.query(query, [idUsuario], (error, resultados) => {
        if (error) {
            console.error("Error al obtener las clases:", error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron clases para este usuario.' });
        }

        // Responder con los resultados
        res.status(200).json(resultados);
    });
};


// Obtener todas las clases con información del curso y usuarios que son profesores
exports.traerPara = async (req, res) => {
    const query = `
        SELECT 
            cl.id_clase,
            cl.hora_inicio,
            cl.hora_final,
            c.nombre_curso,
            c.descripcion,  -- Incluir el campo 'descripcion'
            u.id_usuario,
            du.nombre AS nombre_usuario,
            cl.estado
        FROM 
            clases cl
        JOIN 
            cursos c ON cl.id_curso = c.id_curso
        JOIN 
            usuarios u ON cl.id_usuario = u.id_usuario
        JOIN 
            datos_usuarios du ON u.id_usuario = du.id_usuario
        WHERE 
            cl.estado = 'activo'  -- Filtrar por clases activas
    `;

    try {
        const [rows] = await db.promise().query(query);

        // Transformar los datos para añadir los campos solicitados
        const clasesConHorario = rows.map(clase => {
            // Convertir horas en formato "h.mm am/pm"
            const formatTime = (time) => {
                const [hour, minute] = time.split(':');
                const hourInt = parseInt(hour, 10);
                const period = hourInt >= 12 ? 'pm' : 'am';
                const formattedHour = hourInt % 12 || 12; // Convertir a formato 12 horas
                return `${formattedHour}.${minute}${period}`;
            };

            const horaInicio = formatTime(clase.hora_inicio);
            const horaFinal = formatTime(clase.hora_final);

            // Crear el rango horario en formato "6.00am - 8.00am"
            const time = `${horaInicio} - ${horaFinal}`;

            return {
                id_clase: clase.id_clase,
                nombre_curso: clase.nombre_curso,
                descripcion: clase.descripcion, // Incluir la descripción
                nombre_usuario: clase.nombre_usuario,
                estado: clase.estado,
                time, // Solo el tiempo, sin los días
            };
        });

        res.status(200).json(clasesConHorario);
    } catch (err) {
        console.error('Error en la consulta:', err); // Log del error
        res.status(500).json({ error: 'Error al obtener clases', details: err.message });
    }
};


exports.traerClasesPorEstudiante = async (req, res) => {
    const { id } = req.params; // ID del estudiante
    const { rol } = req.query;
    var query =''
    if (rol ==='profesor') {
        query= `SELECT c.id_clase, cu.nombre_curso, c.hora_inicio, c.hora_final, c.id_usuario, c.estado
    FROM clases c
    INNER JOIN cursos cu ON c.id_curso = cu.id_curso
    WHERE c.id_usuario = ?
    ORDER BY c.id_clase DESC`;
    }else{
        query = `
        SELECT 
            cl.id_clase,
            cl.hora_inicio,
            cl.hora_final,
            c.nombre_curso,
            c.descripcion,
            du.nombre AS nombre_usuario, -- Nombre del profesor
            cl.estado
        FROM 
            clases cl
        JOIN 
            cursos c ON cl.id_curso = c.id_curso
        JOIN 
            clases_estudiantes ce ON cl.id_clase = ce.id_clase
        JOIN 
            usuarios u ON cl.id_usuario = u.id_usuario -- Profesor asignado a la clase
        JOIN 
            datos_usuarios du ON u.id_usuario = du.id_usuario
        WHERE 
            cl.estado = 'activo'
            AND ce.id_usuario = ?;
    `;
    }
    

    try {
        const [rows] = await db.promise().query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron clases para este estudiante." });
        }

        // Formatear las horas al formato 12h con AM/PM
        const formatTime = (time) => {
            const [hour, minute] = time.split(':').map(Number);
            const ampm = hour >= 12 ? 'pm' : 'am';
            const formattedHour = hour % 12 || 12; // Convertir a formato 12h
            return `${formattedHour}.${minute}${ampm}`;
        };

        const formattedRows = rows.map(row => ({
            ...row,
            time: `${formatTime(row.hora_inicio)} - ${formatTime(row.hora_final)}`, // Formatear rango
        }));

        res.status(200).json(formattedRows);
    } catch (err) {
        console.error('Error al obtener las clases:', err);
        res.status(500).json({ error: "Error al obtener las clases", details: err.message });
    }
};




exports.traer = async (req, res) => {
    const query = `
        SELECT 
            cl.id_clase,
            cl.hora_inicio,
            cl.id_curso,
            cl.hora_final,
            c.nombre_curso,
            u.id_usuario,
            du.nombre AS nombre_usuario,
            cl.estado
        FROM 
            clases cl
        JOIN 
            cursos c ON cl.id_curso = c.id_curso
        JOIN 
            usuarios u ON cl.id_usuario = u.id_usuario
        JOIN 
            datos_usuarios du ON u.id_usuario = du.id_usuario
    `;

    try {
        const results = await db.promise().query(query);
     
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error en la consulta:', err); // Log del error
        res.status(500).json({ error: 'Error al obtener clases', details: err.message });
    }
};



exports.obtenerCursos = (req, res) => {
    const query = `
        SELECT id_curso, nombre_curso 
        FROM cursos 
        WHERE estado = 'activo'
    `; 

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.obtenerProfesores = async (req, res) => {
    const query = `
        SELECT 
            u.id_usuario, 
            du.nombre AS nombre_usuario
        FROM 
            usuarios u
        JOIN 
            datos_usuarios du ON u.id_usuario = du.id_usuario
        WHERE 
            u.id_rol = 2
            AND du.estado = 'habilitado' 
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta de usuarios con id_rol 2:', err);
            return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
        }
        res.status(200).json(results);
    });
};

exports.agregarClase = async (req, res) => {
    const { hora_inicio, hora_final, id_curso, id_usuario, estado } = req.body;

    // Consulta para verificar solapamientos en el horario, sin importar el curso
    const checkOverlapQuery = `
        SELECT COUNT(*) AS count
        FROM clases
        WHERE (
            (hora_inicio < ? AND hora_final > ?) OR  -- La nueva clase empieza antes y termina después
            (hora_inicio < ? AND hora_final > ?)    -- O la nueva clase empieza y termina dentro del rango de otra clase
            OR 
            (hora_inicio BETWEEN ? AND ?)  -- El nuevo horario empieza dentro de otro rango
            OR
            (hora_final BETWEEN ? AND ?)  -- El nuevo horario finaliza dentro de otro rango
        )
    `;

    db.query(checkOverlapQuery, [
        hora_inicio, hora_inicio, 
        hora_final, hora_final,
        hora_inicio, hora_final,
        hora_inicio, hora_final
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al verificar solapamiento de clases', details: err.message });
        }

        if (result[0].count > 0) {
            // Si ya existe una clase en el mismo horario, enviar un error
            return res.status(400).json({ success: false, message: 'Ya existe una clase en este horario.' });
        }

        // Si no hay solapamiento, proceder a agregar la nueva clase
        const query = `
            INSERT INTO clases (hora_inicio, hora_final, id_curso, id_usuario, estado)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [hora_inicio, hora_final, id_curso, id_usuario, estado], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error al agregar la clase', details: err.message });
            }
            res.status(201).json({ success: true, message: 'Clase agregada exitosamente', id_clase: result.insertId });
        });
    });
};





// Actualizar una clase
exports.actualizarClase = async (req, res) => {  
    const { id } = req.params;
    const { hora_inicio, hora_final, id_curso, id_usuario, estado } = req.body;

    try {
        // Validación de hora de finalización
        if (hora_final <= hora_inicio) {
            return res.status(400).json({
                success: false,
                message: 'La hora de finalización no puede ser inferior a la hora de inicio.'
            });
        }

        // Si el estado es "activo", validar si el profesor está habilitado
        if (estado === 'activo' && id_usuario) {
            const checkProfesorQuery = `
                SELECT nombre, apellido, estado 
                FROM datos_usuarios
                WHERE id_usuario = ?
            `;
            const [profesor] = await db.promise().query(checkProfesorQuery, [id_usuario]);

            if (profesor.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'El profesor asociado a esta clase no existe.'
                });
            }

            if (profesor[0].estado === 'deshabilitado') {
                return res.status(400).json({
                    success: false,
                    message: `La clase no puede ser activada porque el profesor ${profesor[0].nombre} ${profesor[0].apellido} está deshabilitado. Por favor habilítalo o asigna un profesor nuevo primero.`
                });
            }
        }

        // Verificar conflictos de horarios sin importar el curso
        const checkOverlapQuery = `
            SELECT COUNT(*) AS count
            FROM clases
            WHERE id_clase != ? 
            AND (
                (hora_inicio < ? AND hora_final > ?) OR
                (hora_inicio < ? AND hora_final > ?) OR
                (hora_inicio BETWEEN ? AND ?) OR
                (hora_final BETWEEN ? AND ?)
            )
        `;
        const [overlapResult] = await db.promise().query(checkOverlapQuery, [
            id, // Ignorar la clase que se está editando
            hora_inicio, hora_inicio, // Verificar si el horario de inicio se cruza
            hora_final, hora_final,   // Verificar si el horario final se cruza
            hora_inicio, hora_final,  // Verificar si el inicio está entre la nueva hora
            hora_inicio, hora_final   // Verificar si el final está entre la nueva hora
        ]);

        if (overlapResult[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Conflicto de horario con otra clase.'
            });
        }

        // Actualizar la clase
        const updateQuery = `
            UPDATE clases
            SET 
                hora_inicio = ?, 
                hora_final = ?, 
                id_curso = ?, 
                id_usuario = ?, 
                estado = ?
            WHERE id_clase = ?
        `;
        const [result] = await db.promise().query(updateQuery, [
            hora_inicio, hora_final, id_curso, id_usuario, estado, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada o no se pudo actualizar.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Clase actualizada exitosamente.'
        });
    } catch (error) {
        console.error('Error interno del servidor:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            details: error.message
        });
    }
};





// Traer Estudiantes
exports.traerEstudiantes = async (req, res) => {
    const query = `
        SELECT 
            u.id_usuario,
            u.correo,
            CONCAT(d.nombre, ' ', d.apellido) AS nombre_completo,
            u.id_rol,
            r.nombre_rol,
            DATE_FORMAT(d.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
            d.estado
        FROM 
            usuarios u
        LEFT JOIN 
            datos_usuarios d ON u.id_usuario = d.id_usuario
        LEFT JOIN 
            roles r ON u.id_rol = r.id_rol
        WHERE 
            u.id_rol = 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener estudiantes', details: err.message });
        }
        res.status(200).json(results);
    });
};


exports.obtenerEstudiantesPorClase = async (req, res) => {
    const { claseId } = req.params;
    try {
        const query = `
            SELECT 
                u.id_usuario,
                u.correo,
                CONCAT(d.nombre, ' ', d.apellido) AS nombre_completo,
                u.id_rol,
                r.nombre_rol,
                DATE_FORMAT(d.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
                d.estado
            FROM 
                usuarios u
            INNER JOIN 
                clases_estudiantes ce ON u.id_usuario = ce.id_usuario
            LEFT JOIN 
                datos_usuarios d ON u.id_usuario = d.id_usuario
            LEFT JOIN 
                roles r ON u.id_rol = r.id_rol
            WHERE 
                ce.id_clase = ?
        `;
        db.query(query, [claseId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener estudiantes por clase', details: err.message });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error al obtener estudiantes por clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};



exports.actualizarEstudiantes = (req, res) => {
    const { claseId, estudiantes } = req.body;

    // Verificar que los datos recibidos son válidos
    if (!claseId || !Array.isArray(estudiantes)) {
        console.error('Datos inválidos:', { claseId, estudiantes });
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    console.log('Iniciando actualización de estudiantes para claseId:', claseId);

    // Obtener la fecha y hora en la zona horaria de Colombia (GMT-5)
    const fechaAgregado = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    // Obtener una conexión del pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err.message);
            return res.status(500).json({ error: 'Error al obtener la conexión', details: err.message });
        }

        // Iniciar transacción
        connection.beginTransaction(err => {
            if (err) {
                console.error('Error al iniciar la transacción:', err.message);
                connection.release();
                return res.status(500).json({ error: 'Error al iniciar la transacción', details: err.message });
            }

            // Consultar los estudiantes actuales de la clase
            const selectQuery = 'SELECT id_usuario FROM clases_estudiantes WHERE id_clase = ?';
            connection.query(selectQuery, [claseId], (err, result) => {
                if (err) {
                    console.error('Error al obtener estudiantes existentes:', err.message);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: 'Error al obtener estudiantes existentes', details: err.message });
                    });
                }

                // Extraer los IDs de los estudiantes existentes
                const estudiantesExistentes = result.map(row => row.id_usuario);

                // Identificar estudiantes para agregar (los que no están en la tabla)
                const estudiantesParaAgregar = estudiantes.filter(usuarioId => !estudiantesExistentes.includes(usuarioId));

                // Identificar estudiantes para eliminar (los que están en la tabla pero no llegaron en la solicitud)
                const estudiantesParaEliminar = estudiantesExistentes.filter(usuarioId => !estudiantes.includes(usuarioId));

                // Promesas para agregar estudiantes
                const insertQuery = 'INSERT INTO clases_estudiantes (id_clase, id_usuario, fecha_agregado) VALUES (?, ?, ?)';
                const insertPromises = estudiantesParaAgregar.map(usuarioId => {
                    return new Promise((resolve, reject) => {
                        connection.query(insertQuery, [claseId, usuarioId, fechaAgregado], (err, result) => {
                            if (err) {
                                console.error('Error al insertar nuevo estudiante:', err.message);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                // Promesas para eliminar estudiantes
                const deleteQuery = 'DELETE FROM clases_estudiantes WHERE id_clase = ? AND id_usuario = ?';
                const deletePromises = estudiantesParaEliminar.map(usuarioId => {
                    return new Promise((resolve, reject) => {
                        connection.query(deleteQuery, [claseId, usuarioId], (err, result) => {
                            if (err) {
                                console.error('Error al eliminar estudiante:', err.message);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                // Ejecutar todas las promesas (inserciones y eliminaciones)
                Promise.all([...insertPromises, ...deletePromises])
                    .then(() => {
                        connection.commit(err => {
                            if (err) {
                                console.error('Error al confirmar la transacción:', err.message);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: 'Error al confirmar la transacción', details: err.message });
                                });
                            }
                            console.log('Estudiantes actualizados exitosamente para claseId:', claseId);
                            connection.release();
                            res.json({ message: 'Estudiantes actualizados exitosamente' });
                        });
                    })
                    .catch(err => {
                        console.error('Error al actualizar estudiantes:', err.message);
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: 'Error al actualizar estudiantes', details: err.message });
                        });
                    });
            });
        });
    });
};


// Eliminar una clase
exports.eliminarClase = async (req, res) => {
    const { id } = req.params;

    // Verificar si existen registros en la tabla `asistencias` relacionados con la clase
    const checkAsistenciasQuery = 'SELECT COUNT(*) AS count FROM asistencias WHERE id_clase = ?';

    db.query(checkAsistenciasQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Error al verificar asistencias', details: err.message });
        }

        if (result[0].count > 0) {
            // Si existen registros en `asistencias`, informar que no se puede eliminar
            return res.status(400).json({
                success: false,
                error: 'No se puede eliminar la clase porque tiene registros en la tabla de asistencias.',
                details: 'La clase tiene registros en la tabla de asistencias, lo cual impide su eliminación.'
            });
        }

        // Verificar si la clase tiene estudiantes asignados
        const checkStudentsQuery = 'SELECT COUNT(*) AS count FROM clases_estudiantes WHERE id_clase = ?';

        db.query(checkStudentsQuery, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Error al verificar estudiantes asignados', details: err.message });
            }

            if (result[0].count > 0) {
                return res.status(400).json({ success: false, error: 'No se puede eliminar la clase porque tiene estudiantes asignados.' });
            }

            // Proceder con la eliminación de la clase
            const deleteQuery = 'DELETE FROM clases WHERE id_clase = ?';

            db.query(deleteQuery, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, error: 'Error al eliminar la clase', details: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, error: 'Clase no encontrada' });
                }
                res.status(200).json({ success: true, message: 'Clase eliminada exitosamente' });
            });
        });
    });
};

