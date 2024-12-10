const db = require('../database/conexion');
const bcrypt = require('bcrypt');

exports.obtenerPerfil = async (req, res) => {
    const id_usuario = req.query.id; // Obtén el id_usuario de los parámetros de la consulta

    // Verificar si el id_usuario está presente
    if (!id_usuario) {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }

    // Consulta SQL para traer los datos requeridos con la fecha de nacimiento en formato DATE
    const query = `
        SELECT 
            ce.id_clase,
            c.id_curso,
            cu.nombre_curso,
            u.id_usuario,
            du.nombre,
            du.apellido,
            DATE_FORMAT(du.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento  
        FROM usuarios u
        LEFT JOIN clases_estudiantes ce ON u.id_usuario = ce.id_usuario 
        LEFT JOIN clases c ON ce.id_clase = c.id_clase  
        LEFT JOIN cursos cu ON c.id_curso = cu.id_curso  
        LEFT JOIN datos_usuarios du ON u.id_usuario = du.id_usuario  
        WHERE u.id_usuario = ?
    `;

    db.query(query, [id_usuario], (err, resultados) => {
        if (err) {
            console.error('Error al obtener el perfil del usuario:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve los datos del perfil del usuario con la clase, curso y fecha de nacimiento formateada
        res.json(resultados[0]);
    });
};


exports.actualizarPerfil = async (req, res) => {
    const { nombre, apellido, correo, fecha_nacimiento } = req.body;  
    const id_usuario = req.query.id;  

    // Verificar si el id_usuario está presente
    if (!id_usuario) {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }

    // Primero, actualizamos el correo en la tabla 'usuarios'
    db.query(
        'UPDATE usuarios SET correo = ? WHERE id_usuario = ?',
        [correo, id_usuario],  // Cambié 'gmail' por 'correo'
        (err, resultados) => {
            if (err) {
                console.error('Error al actualizar el correo:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            // Si no se actualizó nada en usuarios, significa que el usuario no existe
            if (resultados.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Ahora, actualizamos los datos personales (nombre, apellido, fecha_nacimiento) en la tabla 'datos_usuarios'
            db.query(
                'UPDATE datos_usuarios SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id_usuario = ?',
                [nombre, apellido, fecha_nacimiento, id_usuario],
                (err, resultados) => {
                    if (err) {
                        console.error('Error al actualizar los datos del usuario:', err);
                        return res.status(500).json({ message: 'Error interno del servidor' });
                    }

                    // Si no se actualizó nada en datos_usuarios, significa que el usuario no existe en esa tabla
                    if (resultados.affectedRows === 0) {
                        return res.status(404).json({ message: 'Usuario no encontrado en los datos' });
                    }

                    // Si ambas actualizaciones fueron exitosas, respondemos con éxito
                    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
                }
            );
        }
    );
};
