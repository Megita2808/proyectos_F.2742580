const db = require('../database/conexion');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Crear una conexión a la base de datos
const dbbb = mysql.createPool({
    host: '34.83.112.237',
    user: 'root',
    password: `j'&&,|An}Fg"qMRM`,
    database: 'yamix'
});


exports.getUserAssistances = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // Consulta para verificar que el usuario tenga el rol "estudiante".
        const [userRole] = await db.promise().query(
            `SELECT r.nombre_rol 
             FROM usuarios u
             INNER JOIN roles r ON u.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [id_usuario]
        );

        if (!userRole.length || userRole[0].nombre_rol !== 'Estudiante') {
            return res.status(403).json({
                message: 'El usuario no tiene el rol de estudiante o no existe.'
            });
        }

        // Consulta para obtener el nombre y apellido del usuario desde datos_usuarios.
        const [userData] = await db.promise().query(
            `SELECT du.nombre, du.apellido
             FROM datos_usuarios du
             WHERE du.id_usuario = ?`,
            [id_usuario]
        );

        if (!userData.length) {
            return res.status(404).json({
                message: 'No se encontraron datos del usuario especificado.'
            });
        }

        const { nombre, apellido } = userData[0];

        // Consulta para obtener las asistencias del usuario, nombre del profesor, nombre de la clase y nombre del curso.
        const [assistances] = await db.promise().query(
            `SELECT 
                a.id_asistencia, 
                a.fecha_asistencia, 
                ua.presente, 
                c.id_clase, 
                cu.nombre_curso, 
                du.nombre AS profesor, 
                du.apellido AS profesor_apellido,
                c.hora_inicio, 
                c.hora_final
            FROM asistencias a
            INNER JOIN asistencias_estudiantes ua ON a.id_asistencia = ua.id_asistencia
            INNER JOIN clases c ON a.id_clase = c.id_clase
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            INNER JOIN datos_usuarios du ON u.id_usuario = du.id_usuario
            INNER JOIN cursos cu ON c.id_curso = cu.id_curso
            WHERE ua.id_usuario = ?`,
            [id_usuario]
        );

        const formattedAssistances = assistances.map(assistance => {
            const fecha = new Date(assistance.fecha_asistencia);
            const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
        
            return {
                id_asistencia: assistance.id_asistencia,
                fecha_asistencia: fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1),
                presente: assistance.presente === 1 ? 'Asistió' : 'No asistió',
                id_clase: assistance.id_clase,
                nombre_curso: assistance.nombre_curso,
                profesor: `${assistance.profesor} ${assistance.profesor_apellido}`,
                hora_inicio: assistance.hora_inicio,
                hora_final: assistance.hora_final
            };
        });
        
        // Respuesta con las asistencias y datos del usuario.
        res.status(200).json({
            message: 'Asistencias obtenidas correctamente.',
            data: {
                usuario: `${nombre} ${apellido}`,
                asistencias: formattedAssistances
            }
        });
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        res.status(500).json({
            message: 'Hubo un error al procesar la solicitud.',
            error: error.message
        });
    }
};



exports.traerAsistencias = async (req, res) => {
    try {
        // Consultar todas las asistencias con detalles de la clase, nombre del curso y nombre del instructor
        const [asistencias] = await dbbb.query(`
            SELECT 
                a.id_asistencia,
                a.fecha_asistencia,
                c.id_clase,
                cu.nombre_curso,
                c.hora_inicio,
                c.hora_final,
                CONCAT(di.nombre, ' ', di.apellido) AS nombre_instructor
            FROM 
                asistencias a
            JOIN 
                clases c ON a.id_clase = c.id_clase
            JOIN 
                cursos cu ON c.id_curso = cu.id_curso
            JOIN 
                usuarios ui ON c.id_usuario = ui.id_usuario         -- Instructor de la clase
            JOIN 
                datos_usuarios di ON ui.id_usuario = di.id_usuario  -- Datos del instructor (nombre y apellido)
        `);

        // Verificar si se encontraron asistencias


        // Consultar los detalles de los estudiantes para cada asistencia
        const results = await Promise.all(asistencias.map(async asistencia => {
            const [estudiantes] = await dbbb.query(`
                SELECT ae.id_asistencia, u.id_usuario, 
                    CONCAT(du.nombre, ' ', du.apellido) AS nombre_usuario, 
                    CASE ae.presente 
                        WHEN 1 THEN 'sí' 
                        ELSE 'no' 
                    END AS presente
                FROM asistencias_estudiantes ae
                JOIN usuarios u ON ae.id_usuario = u.id_usuario
                JOIN datos_usuarios du ON u.id_usuario = du.id_usuario  -- Obtener nombre y apellido del estudiante desde datos_usuarios
                WHERE ae.id_asistencia = ?
            `, [asistencia.id_asistencia]);

            return {
                ...asistencia,
                estudiantes
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).json({ message: 'Error al obtener las asistencias', error: error.message });
    }
};


exports.crearAsistencia = async (req, res) => {
    try {
        console.log(req.body);
        const { id_clase, fecha_asistencia, estudiantes } = req.body;

        // Validar datos de entrada
        if (!id_clase || !fecha_asistencia || !Array.isArray(estudiantes) || estudiantes.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos. Verifica que estudiantes sea un array y tenga elementos.' });
        }

        // Insertar el registro de asistencia
        const [result] = await dbbb.query(`
            INSERT INTO asistencias (id_clase, fecha_asistencia) 
            VALUES (?, ?)`, [id_clase, fecha_asistencia]
        );

        console.log('Resultado de la inserción en asistencia:', result);

        const id_asistencia = result.insertId;

        // Verifica que el id_asistencia sea válido
        if (!id_asistencia) {
            return res.status(500).json({ message: 'Error al obtener el ID de la asistencia.' });
        }

        // Insertar registros en la tabla intermedia asistencias_estudiantes
        const promises = estudiantes.map(estudiante => {

            console.log(`Insertando en asistencias_estudiantes: id_asistencia=${id_asistencia}, id_usuario=${estudiante.id_usuario}, presente=${estudiante.presente}`);

            return dbbb.query(`
                INSERT INTO asistencias_estudiantes (id_asistencia, id_usuario, presente)
                VALUES (?, ?, ?)`, [id_asistencia, estudiante.id_usuario, estudiante.presente]
            );
        });

        await Promise.all(promises);

        res.status(201).json({ message: 'Asistencia registrada con éxito' });
    } catch (error) {
        console.error('Error en createAsistencia:', error); // Agrega más detalles para depurar
        res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
    }
};

exports.obtenerEstudiantesPorClase = (req, res) => {
    const { id_clase } = req.params;  // Obtenemos el id_clase de los parámetros de la ruta
    const { fecha_asistencia } = req.query;  // Obtenemos la fecha de los parámetros de la URL

    // Consulta para obtener estudiantes que están asignados a la clase
    const query = `
        SELECT 
            u.id_usuario,
            du.nombre,
            du.apellido,
            u.correo,
            ce.fecha_agregado  -- También incluimos la fecha de agregado
        FROM usuarios u
        JOIN clases_estudiantes ce ON u.id_usuario = ce.id_usuario  -- Relación con la tabla clases_estudiantes
        JOIN clases c ON ce.id_clase = c.id_clase  -- Relación con la tabla clases
        JOIN datos_usuarios du ON u.id_usuario = du.id_usuario  -- Relación con la tabla datos_usuarios
        WHERE ce.id_clase = ? 
          AND u.id_rol = 1  -- Filtrar solo usuarios con rol de estudiante
          AND ce.fecha_agregado <= ?;  -- Filtrar por la fecha de agregado a la clase
    `;

    db.query(query, [id_clase, fecha_asistencia], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los estudiantes', details: err.message });
        }
        res.status(200).json(results);
    });
};




// Función para actualizar la fecha de la asistencia
exports.actualizarFechaAsistencia = async (req, res) => {
    const { id_asistencia } = req.params;
    const { fecha_asistencia } = req.body;

    try {
        // Consulta SQL para actualizar la fecha de la asistencia
        const [result] = await dbbb.query(
            'UPDATE asistencias SET fecha_asistencia = ? WHERE id_asistencia = ?',
            [fecha_asistencia, id_asistencia]
        );

        // Verificamos si la actualización fue exitosa
        if (result.affectedRows > 0) {
            return res.json({ message: 'Fecha de asistencia actualizada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la fecha de la asistencia' });
    }
};

// Función para obtener los estudiantes por asistencia
exports.estudiantesPorAsistencia = async (req, res) => {
    const { id_asistencia } = req.params;

    if (!id_asistencia) {
        return res.status(400).json({ message: 'El id_asistencia es requerido' });
    }

    const query = `
        SELECT 
            ae.id_asistencia, 
            ae.id_usuario, 
            ae.presente, 
            du.nombre, 
            du.apellido
        FROM 
            asistencias_estudiantes ae
        JOIN 
            datos_usuarios du ON ae.id_usuario = du.id_usuario
        WHERE 
            ae.id_asistencia = ?
    `;

    try {
        const [results] = await dbbb.query(query, [id_asistencia]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron estudiantes para esta asistencia' });
        }
        res.status(200).json({ estudiantes: results });
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        res.status(500).json({ message: 'Error al obtener los estudiantes' });
    }
};

// Función para actualizar la asistencia de los estudiantes
exports.actualizarAsistenciaEstudiantes = async (req, res) => {
    const { id_asistencia, cambios } = req.body;

    // Validar que id_asistencia y cambios estén presentes
    if (!id_asistencia || !Array.isArray(cambios)) {
        console.log("Datos inválidos:", { id_asistencia, cambios });
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        // Actualizar cada estudiante en la tabla asistencia_estudiantes
        for (let i = 0; i < cambios.length; i++) {
            const { id_usuario, presente } = cambios[i];
            
            // Verificar que cada cambio tiene los campos esperados
            if (!id_usuario || (presente !== 0 && presente !== 1)) {
                console.log("Datos inválidos en el cambio:", cambios[i]);
                return res.status(400).json({ message: 'Datos de cambio inválidos' });
            }

            const query = 'UPDATE asistencias_estudiantes SET presente = ? WHERE id_asistencia = ? AND id_usuario = ?';
            await dbbb.query(query, [presente, id_asistencia, id_usuario]);
        }

        return res.status(200).json({ message: 'Asistencia actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la asistencia:', error);
        return res.status(500).json({ message: 'Error al actualizar la asistencia' });
    }
};


exports.asistenciasPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Consultar todas las asistencias para el usuario especificado
        const [asistencias] = await dbbb.query(`
            SELECT a.id_asistencia, a.id_clase, a.fecha_asistencia, cu.nombre_curso
            FROM asistencia a
            JOIN clases c ON a.id_clase = c.id_clase
            JOIN cursos cu ON c.id_curso = cu.id_curso  -- Aquí traemos el nombre del curso desde la tabla cursos
            JOIN asistencia_estudiantes ae ON a.id_asistencia = ae.id_asistencia
            WHERE ae.id_usuario = ?
        `, [id_usuario]);

        // Verificar si se encontraron asistencias
        if (asistencias.length === 0) {
            return res.status(200).json([]);
        }
        
        // Consultar los detalles del estudiante especificado para cada asistencia
        const results = await Promise.all(asistencias.map(async asistencia => {
            const [estudiante] = await dbbb.query(`
                SELECT ae.id_asistencia, u.id_usuario, u.nombre AS nombre_usuario, 
                    CASE ae.presente 
                        WHEN 1 THEN 'sí' 
                        ELSE 'no' 
                    END AS presente
                FROM asistencia_estudiantes ae
                JOIN usuarios u ON ae.id_usuario = u.id_usuario
                WHERE ae.id_asistencia = ? AND ae.id_usuario = ?
            `, [asistencia.id_asistencia, id_usuario]);

            return {
                ...asistencia,
                estudiante
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener asistencias por usuario:', error);
        res.status(500).json({ message: 'Error al obtener asistencias por usuario', error: error.message });
    }
};

exports.asistenciaPorId = async (req, res) => {
    const { id_asistencia } = req.params; // Obtén el id_asistencia del parámetro de la ruta

    try {
        // Consultar la asistencia específica con detalles de la clase, curso y nombre del instructor
        const [asistencia] = await dbbb.query(`
            SELECT 
                a.id_asistencia, 
                a.fecha_asistencia, 
                c.id_clase, 
                cu.nombre_curso,
                c.hora_inicio, 
                c.hora_final,
                CONCAT(di.nombre, ' ', di.apellido) AS nombre_instructor
            FROM 
                asistencias a
            JOIN 
                clases c ON a.id_clase = c.id_clase
            JOIN 
                cursos cu ON c.id_curso = cu.id_curso
            JOIN 
                usuarios ui ON c.id_usuario = ui.id_usuario         -- Instructor de la clase
            JOIN 
                datos_usuarios di ON ui.id_usuario = di.id_usuario  -- Datos del instructor
            WHERE 
                a.id_asistencia = ?
        `, [id_asistencia]);

        // Verificar si se encontró la asistencia
        if (asistencia.length === 0) {
            return res.status(404).json({ message: 'Asistencia no encontrada.' });
        }

        // Consultar los detalles de los estudiantes para la asistencia específica
        const [estudiantes] = await dbbb.query(`
            SELECT 
                ae.id_asistencia, 
                u.id_usuario, 
                CONCAT(du.nombre, ' ', du.apellido) AS nombre_usuario, 
                CASE ae.presente 
                    WHEN 1 THEN 'sí' 
                    ELSE 'no' 
                END AS presente
            FROM 
                asistencias_estudiantes ae
            JOIN 
                usuarios u ON ae.id_usuario = u.id_usuario
            JOIN 
                datos_usuarios du ON u.id_usuario = du.id_usuario  -- Obtener nombre y apellido del estudiante desde datos_usuarios
            WHERE 
                ae.id_asistencia = ?
        `, [id_asistencia]);

        // Devolver los detalles de la asistencia y los estudiantes asociados
        res.status(200).json({
            ...asistencia[0], // La consulta devuelve un array, tomamos el primer elemento
            estudiantes
        });
    } catch (error) {
        console.error('Error al obtener la asistencia:', error);
        res.status(500).json({ message: 'Error al obtener la asistencia', error: error.message });
    }
};


// Traer asistencias del profesor
exports.traerAsistenciaProfe = async (req, res) => { 
    try {
        const { id_usuario } = req.params;

        const [asistencias] = await dbbb.query(`
            SELECT 
                a.id_asistencia,
                a.fecha_asistencia,
                c.id_clase,
                cu.nombre_curso,
                c.hora_inicio,
                c.hora_final,
                CONCAT(di.nombre, ' ', di.apellido) AS nombre_instructor
            FROM 
                asistencias a
            JOIN 
                clases c ON a.id_clase = c.id_clase
            JOIN 
                cursos cu ON c.id_curso = cu.id_curso
            JOIN 
                usuarios ui ON c.id_usuario = ui.id_usuario
            JOIN 
                datos_usuarios di ON ui.id_usuario = di.id_usuario
            WHERE 
                ui.id_usuario = ?
        `, [id_usuario]);

        const results = await Promise.all(asistencias.map(async asistencia => {
            const [estudiantes] = await dbbb.query(`
                SELECT 
                    ae.id_asistencia, 
                    u.id_usuario, 
                    CONCAT(du.nombre, ' ', du.apellido) AS nombre_usuario, 
                    CASE ae.presente 
                        WHEN 1 THEN 'sí' 
                        ELSE 'no' 
                    END AS presente
                FROM 
                    asistencias_estudiantes ae
                JOIN 
                    usuarios u ON ae.id_usuario = u.id_usuario
                JOIN 
                    datos_usuarios du ON u.id_usuario = du.id_usuario
                WHERE 
                    ae.id_asistencia = ?
            `, [asistencia.id_asistencia]);

            return {
                ...asistencia,
                estudiantes
            };
        }));

        res.status(200).json(results.length > 0 ? results : []); // Devolver un array vacío si no hay asistencias
    } catch (error) {
        console.error('Error al obtener las asistencias del profesor:', error);
        res.status(500).json({ message: 'Error al obtener las asistencias del profesor', error: error.message });
    }
};



