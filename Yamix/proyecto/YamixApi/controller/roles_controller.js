const db = require('../database/conexion');

exports.traer = async (req, res) => {
    const query = `
        SELECT 
            r.id_rol,
            r.nombre_rol,
            GROUP_CONCAT(p.nombre_permiso SEPARATOR ', ') AS permisos
        FROM 
            roles r
        LEFT JOIN 
            permisos_rol pr ON r.id_rol = pr.id_rol
        LEFT JOIN 
            permisos p ON pr.id_permiso = p.id_permiso
        GROUP BY 
            r.id_rol, r.nombre_rol
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener roles y permisos', details: err.message });
        }
        // Convertir la cadena de permisos a un array
        results.forEach(rol => {
            rol.permisos = rol.permisos ? rol.permisos.split(', ').map(permiso => permiso.trim()) : [];
        });
        res.status(200).json(results);
    });
};

// Agregar rol
exports.agregarRol = async (req, res) => {
    let { nombre_rol } = req.body;

    // Verificar que el nombre_rol fue proporcionado
    if (!nombre_rol) {
        return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }

    // Eliminar espacios en blanco al principio y al final del nombre del rol
    nombre_rol = nombre_rol.trim();

    try {
        // Verificar si el rol ya existe en la base de datos
        const checkRolQuery = 'SELECT COUNT(*) AS count FROM roles WHERE nombre_rol = ?';
        db.query(checkRolQuery, [nombre_rol], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al verificar el rol' });
            }

            // Si el rol ya existe, retornar un error
            if (result[0].count > 0) {
                return res.status(400).json({ error: 'El rol ya existe' });
            }

            // Insertar el nuevo rol en la tabla 'roles'
            const insertRolQuery = 'INSERT INTO roles (nombre_rol) VALUES (?)';
            db.query(insertRolQuery, [nombre_rol], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al agregar el rol' });
                }
                // Devolver solo el ID del rol agregado
                const rolId = result.insertId;
                res.status(201).json({ id_rol: rolId }); // Solo devolver el ID
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};


// Editar rol
exports.editarRol = async (req, res) => {
    const { id_rol } = req.params; // Obtener el ID del rol desde los parámetros
    let { nombre_rol } = req.body; // Obtener el nuevo nombre del rol del cuerpo de la solicitud

    // Verificar que el nombre del rol fue proporcionado
    if (!nombre_rol) {
        return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }

    // Eliminar espacios en blanco al principio y al final del nombre del rol
    nombre_rol = nombre_rol.trim();

    try {
        // Verificar si ya existe un rol con el mismo nombre
        const checkRolQuery = 'SELECT COUNT(*) AS count FROM roles WHERE nombre_rol = ? AND id_rol != ?';
        db.query(checkRolQuery, [nombre_rol, id_rol], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al verificar el rol' });
            }

            // Si el rol con el mismo nombre ya existe, retornar un error
            if (result[0].count > 0) {
                return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
            }

            // Actualizar el nombre del rol en la tabla 'roles'
            const updateRolQuery = 'UPDATE roles SET nombre_rol = ? WHERE id_rol = ?';
            db.query(updateRolQuery, [nombre_rol, id_rol], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al actualizar el rol', details: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Rol no encontrado' });
                }
                res.status(200).json({ message: 'Rol actualizado exitosamente' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};





// Eliminar rol
exports.eliminarRol = async (req, res) => {
    const { id_rol } = req.params; // Obtener el ID del rol desde los parámetros

    // Verificar que el id_rol fue proporcionado
    if (!id_rol) {
        return res.status(400).json({ error: 'El ID del rol es requerido' });
    }

    try {
        // Verificar si el rol está asignado a algún usuario
        const checkRoleQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE id_rol = ?';
        db.query(checkRoleQuery, [id_rol], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al verificar el rol', details: err.message });
            }

            // Si el rol está en uso (hay usuarios con este rol asignado)
            if (result[0].count > 0) {
                return res.status(400).json({ error: 'No se puede eliminar el rol, está en uso por uno o más usuarios' });
            }

            // Verificar si hay registros en la tabla 'permisos_rol' que hagan referencia a este rol
            const checkPermisosRolQuery = 'SELECT COUNT(*) AS count FROM permisos_rol WHERE id_rol = ?';
            db.query(checkPermisosRolQuery, [id_rol], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al verificar los permisos del rol', details: err.message });
                }

                // Si hay registros en la tabla permisos_rol, eliminarlos antes de eliminar el rol
                if (result[0].count > 0) {
                    const deletePermisosQuery = 'DELETE FROM permisos_rol WHERE id_rol = ?';
                    db.query(deletePermisosQuery, [id_rol], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error al eliminar permisos del rol', details: err.message });
                        }

                        // Proceder a eliminar el rol
                        const deleteRolQuery = 'DELETE FROM roles WHERE id_rol = ?';
                        db.query(deleteRolQuery, [id_rol], (err, result) => {
                            if (err) {
                                return res.status(500).json({ error: 'Error al eliminar el rol', details: err.message });
                            }
                            if (result.affectedRows === 0) {
                                return res.status(404).json({ error: 'Rol no encontrado' });
                            }
                            res.status(200).json({ message: 'Rol eliminado exitosamente' });
                        });
                    });
                } else {
                    // Si no hay registros en permisos_rol, eliminar el rol directamente
                    const deleteRolQuery = 'DELETE FROM roles WHERE id_rol = ?';
                    db.query(deleteRolQuery, [id_rol], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error al eliminar el rol', details: err.message });
                        }
                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: 'Rol no encontrado' });
                        }
                        res.status(200).json({ message: 'Rol eliminado exitosamente' });
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};



exports.obtenerPermisos = (req, res) => {
    try {
        const query = 'SELECT * FROM permisos'; // Ajusta esta consulta según tu estructura de base de datos
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener permisos', details: err.message });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};

exports.obtenerPermisosPorRol = async (req, res) => {
    const { rolId } = req.params;
    try {
        const query = `
            SELECT p.id_permiso, p.nombre_permiso
            FROM permisos p
            INNER JOIN permisos_rol pr ON p.id_permiso = pr.id_permiso
            WHERE pr.id_rol = ?
        `;
        db.query(query, [rolId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener permisos por rol', details: err.message });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error al obtener permisos por rol:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Controlador para agregar o actualizar permisos
exports.actualizarPermisos = (req, res) => {
    const { rolId, permisos } = req.body;

    // Verificar que los datos recibidos son válidos
    if (!rolId || !Array.isArray(permisos)) {
        console.error('Datos inválidos:', { rolId, permisos });
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    console.log('Iniciando actualización de permisos para rolId:', rolId);

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
                connection.release(); // Asegúrate de liberar la conexión si hay un error
                return res.status(500).json({ error: 'Error al iniciar la transacción', details: err.message });
            }

            // Eliminar permisos antiguos
            const deleteQuery = 'DELETE FROM permisos_rol WHERE id_rol = ?';
            connection.query(deleteQuery, [rolId], (err, result) => {
                if (err) {
                    console.error('Error al eliminar permisos antiguos:', err.message);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: 'Error al eliminar permisos antiguos', details: err.message });
                    });
                }

                console.log('Permisos antiguos eliminados para rolId:', rolId);

                // Insertar permisos nuevos
                const insertQuery = 'INSERT INTO permisos_rol (id_rol, id_permiso) VALUES (?, ?)';
                const permisosPromises = permisos.map(permisoId => {
                    return new Promise((resolve, reject) => {
                        connection.query(insertQuery, [rolId, permisoId], (err, result) => {
                            if (err) {
                                console.error('Error al insertar nuevo permiso:', err.message);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                // Ejecutar todas las inserciones de permisos
                Promise.all(permisosPromises)
                    .then(() => {
                        connection.commit(err => {
                            if (err) {
                                console.error('Error al confirmar la transacción:', err.message);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: 'Error al confirmar la transacción', details: err.message });
                                });
                            }
                            console.log('Permisos actualizados exitosamente para rolId:', rolId);
                            connection.release();
                            res.json({ message: 'Permisos actualizados exitosamente' });
                        });
                    })
                    .catch(err => {
                        console.error('Error al insertar nuevos permisos:', err.message);
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: 'Error al insertar nuevos permisos', details: err.message });
                        });
                    });
            });
        });
    });
};