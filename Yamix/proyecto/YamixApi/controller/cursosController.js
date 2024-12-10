const db = require('../database/conexion');
const fs = require('fs');
const path = require('path');

// Obtener todos los cursos
exports.traer = async (req, res) => {
    const query = `
        SELECT 
            id_curso,
            nombre_curso,
            descripcion,
            link,
            estado
        FROM 
            cursos
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener cursos', details: err.message });
        }

        // Agregar el campo link con la URL completa
        const cursos = results.map(curso => ({
            ...curso,
            link: curso.link 
                ? `${req.protocol}://${req.get('host')}/${curso.link.replace(/\\/g, '/')}` 
                : null // Manejar casos donde link sea null o undefined
        }));

        res.status(200).json(cursos);
    });
};



exports.traerParaCur = async (req, res) => {
    const query = `
        SELECT 
            id_curso,
            nombre_curso,
            descripcion
        FROM 
            cursos
        WHERE 
            estado = 'activo' -- Solo cursos activos
    `;

    try {
        const [rows] = await db.promise().query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error al obtener cursos activos:', err); // Log del error
        res.status(500).json({ error: 'Error al obtener cursos', details: err.message });
    }
};

exports.obtenerRolYEstado = async (req, res) => {
    const { id_usuario } = req.params;  // Obtienes el id_usuario desde los parámetros de la ruta

    try {
        // Consulta extendida para obtener id_rol, estado y las clases a las que pertenece el usuario
        const query = `
            SELECT u.id_rol, du.estado, ce.id_clase, c.id_curso
            FROM usuarios u
            JOIN datos_usuarios du ON u.id_usuario = du.id_usuario
            LEFT JOIN clases_estudiantes ce ON u.id_usuario = ce.id_usuario
            LEFT JOIN clases c ON ce.id_clase = c.id_clase
            WHERE u.id_usuario = ?
        `;

        // Usamos db.promise().query() para obtener los resultados de la consulta
        const [rows] = await db.promise().query(query, [id_usuario]);

        // Verificamos si se encontró al usuario
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Desestructuramos el id_rol y estado de los resultados
        const { id_rol, estado } = rows[0];

        // Obtenemos los id_clase y id_curso. Como puede haber múltiples, los almacenamos en arrays
        const clases = rows.map(row => ({
            id_clase: row.id_clase,
            id_curso: row.id_curso
        })).filter(row => row.id_clase !== null);

        // Devolvemos los datos de id_rol, estado y las clases a las que pertenece el usuario
        res.json({ id_rol, estado, clases });
    } catch (error) {
        console.error('Error al obtener rol, estado y clases:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.agregarAclase = async (req, res) => {
    try {
        const { id_usuario, id_clase } = req.body;

        // Validar que los datos requeridos estén presentes
        if (!id_usuario || !id_clase) {
            return res.status(400).json({ mensaje: "Faltan datos requeridos (id_usuario o id_clase)." });
        }

        // Obtener el id_rol del usuario
        const queryRol = `SELECT id_rol FROM usuarios WHERE id_usuario = ?`;
        const [rows] = await db.promise().query(queryRol, [id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "El usuario no existe." });
        }

        const { id_rol } = rows[0];

        // Si el id_rol es 4, actualizarlo a 1
        if (id_rol === 4) {
            const queryActualizarRol = `UPDATE usuarios SET id_rol = 1 WHERE id_usuario = ?`;
            await db.promise().query(queryActualizarRol, [id_usuario]);
        }

        // Obtener la fecha actual en formato válido para MySQL (YYYY-MM-DD HH:MM:SS)
        const fechaActual = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
        const fechaMySQL = new Date(fechaActual).toISOString().slice(0, 19).replace('T', ' ');

        // Insertar en la tabla clases_estudiantes con la fecha actual
        const queryInsertar = `
            INSERT INTO clases_estudiantes (id_usuario, id_clase, fecha_agregado)
            VALUES (?, ?, ?)
        `;
        await db.promise().query(queryInsertar, [id_usuario, id_clase, fechaMySQL]);

        res.status(201).json({ mensaje: "Registro agregado exitosamente." });
    } catch (error) {
        console.error("Error al agregar el registro a la clase:", error);
        res.status(500).json({ mensaje: "Ocurrió un error al registrar el estudiante en la clase." });
    }
};




exports.eliminarDeClase = async (req, res) => {
    try {
        const { id_usuario, id_clase } = req.body;

        // Validar que los datos requeridos estén presentes
        if (!id_usuario || !id_clase) {
            return res.status(400).json({ mensaje: "Faltan datos requeridos (id_usuario o id_clase)." });
        }

        // Eliminar el registro de la tabla clases_estudiantes
        const query = `
            DELETE FROM clases_estudiantes
            WHERE id_usuario = ? AND id_clase = ?
        `;
        const [result] = await db.promise().query(query, [id_usuario, id_clase]);

        // Verificar si se eliminó un registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró un registro con los datos proporcionados." });
        }

        res.status(200).json({ mensaje: "Registro eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el registro de la clase:", error);
        res.status(500).json({ mensaje: "Ocurrió un error al eliminar el estudiante de la clase." });
    }
};





exports.agregarCurso = async (req, res) => {
    console.log("HOla")
    let { nombre_curso, descripcion, estado } = req.body;
    const imagen = req.file; // Multer guarda la imagen en req.file
    // Eliminar espacios al principio y al final de las cadenas
    nombre_curso = nombre_curso.trim();
    descripcion = descripcion.trim();
    estado = estado.trim(); 
    console.log(imagen); // Ver la información del archivo (puedes eliminar esta línea en producción)
    // Validaciones previas
    if (!nombre_curso || !descripcion || !estado || !imagen) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, incluida la imagen.' });
    }

    const checkQuery = `
        SELECT COUNT(*) AS count
        FROM cursos
        WHERE nombre_curso = ?
    `;

    try {
        // Verificar si el curso ya existe
        const [rows] = await db.promise().query(checkQuery, [nombre_curso]);
        if (rows[0].count > 0) {
            return res.status(400).json({ error: 'El curso ya existe. Por favor, elige otro nombre.' });
        }

        // Obtener el nombre del archivo de la imagen cargada
        const imagenRuta = imagen.path; // Ruta local donde se guardó la imagen

        // Insertar el curso con la ruta de la imagen
        const insertQuery = `
            INSERT INTO cursos (nombre_curso, descripcion, estado, link)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.promise().query(insertQuery, [nombre_curso, descripcion, estado, imagenRuta]);

        // Responder con el ID del curso insertado
        res.status(200).json({ message: 'Curso agregado exitosamente', id_curso: result.insertId });
    } catch (err) {
        console.error('Error al agregar el curso:', err);
        res.status(500).json({ error: 'Error al agregar el curso', details: err.message });
    }
};

// Editar un curso con posibilidad de actualizar la imagen
exports.actualizarCurso = async (req, res) => {
    const { id } = req.params;
    const { nombre_curso, descripcion, estado } = req.body;
    const imagen = req.file; // Multer guarda la imagen en req.file

    // Eliminar espacios al principio y al final de las cadenas
    const nombreCurso = nombre_curso.trim();
    const descripcionCurso = descripcion.trim();
    const estadoCurso = estado.trim();
    
    // Validaciones previas
    if (!id || !nombreCurso || !descripcionCurso || !estadoCurso) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Comprobar si el curso existe
    const checkQuery = `SELECT * FROM cursos WHERE id_curso = ?`;
    try {
        const [rows] = await db.promise().query(checkQuery, [id]);

        // Si no existe el curso
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado.' });
        }

        // Verificar si el nombre del curso ya existe en otro curso
        const checkNameQuery = `SELECT COUNT(*) AS count FROM cursos WHERE nombre_curso = ? AND id_curso != ?`;
        const [nameRows] = await db.promise().query(checkNameQuery, [nombreCurso, id]);
        if (nameRows[0].count > 0) {
            return res.status(400).json({ error: 'El nombre del curso ya existe. Por favor, elige otro nombre.' });
        }

        // Obtener la imagen anterior
        const imagenAnterior = rows[0].link;

        // Si hay una nueva imagen
        let linkImagen = rows[0].link; // Mantener la imagen actual si no se sube una nueva
        if (imagen) {
            // Eliminar la imagen anterior si existe
            if (imagenAnterior) {
                const filePath = path.join(__dirname, '..', imagenAnterior); // Ruta completa de la imagen
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Elimina la imagen
                }
            }
            linkImagen = imagen.path; // Actualizamos la ruta con la nueva imagen
        }

        // Actualizar los datos del curso
        const updateQuery = `
            UPDATE cursos 
            SET nombre_curso = ?, descripcion = ?, estado = ?, link = ?
            WHERE id_curso = ?
        `;
        const [result] = await db.promise().query(updateQuery, [nombreCurso, descripcionCurso, estadoCurso, linkImagen, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Curso actualizado exitosamente.' });
        } else {
            res.status(400).json({ error: 'No se pudo actualizar el curso.' });
        }
    } catch (err) {
        console.error('Error al editar el curso:', err);
        res.status(500).json({ error: 'Error al editar el curso', details: err.message });
    }
};



exports.eliminarCurso = async (req, res) => {
    const { id } = req.params;

    const checkClaseQuery = 'SELECT COUNT(*) AS count FROM clases WHERE id_curso = ?';
    const checkEventoQuery = 'SELECT COUNT(*) AS count FROM eventos WHERE id_curso = ?';
    const getCursoQuery = 'SELECT link FROM cursos WHERE id_curso = ?';
    const deleteQuery = 'DELETE FROM cursos WHERE id_curso = ?';

    try {
        // Verificar relación con clases
        const [claseResult] = await db.promise().query(checkClaseQuery, [id]);
        const claseCount = claseResult[0].count;

        // Verificar relación con eventos
        const [eventoResult] = await db.promise().query(checkEventoQuery, [id]);
        const eventoCount = eventoResult[0].count;

        if (claseCount > 0 || eventoCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'No puedes eliminar un curso que está siendo utilizado por una clase o un evento.'
            });
        }

        // Obtener el link del archivo asociado
        const [cursoResult] = await db.promise().query(getCursoQuery, [id]);
        if (cursoResult.length === 0) {
            return res.status(404).json({ success: false, error: 'Curso no encontrado.' });
        }
        const { link } = cursoResult[0];

        // Eliminar el archivo asociado si existe
        if (link) {
            const filePath = path.join(__dirname, '..', 'uploads', link.replace(/^uploads[\\/]/, ''));
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') { // Ignorar error si el archivo ya no existe
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }

        // Eliminar el curso de la base de datos
        const [deleteResult] = await db.promise().query(deleteQuery, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Curso no encontrado.' });
        }

        return res.status(200).json({ success: true, message: 'Curso eliminado exitosamente.' });

    } catch (err) {
        console.error('Error al eliminar el curso:', err);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor.',
            details: err.message
        });
    }
};

