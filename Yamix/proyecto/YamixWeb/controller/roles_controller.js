const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.traer = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_roles`);
        const data = await response.json(); 
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Agregar rol
exports.agregarRol = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/agregar_rol`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Se espera que req.body tenga el nombre_rol
        });

        if (!response.ok) {
            const result = await response.json();
            console.error('Error al agregar el rol en el proyecto:', result.error);
            return res.status(500).json({ error: 'Error al agregar el rol' });
        }

        // Redirigir a la vista de permisos después de agregar el rol
        res.redirect('/permisos'); // Asegúrate de cambiar esto a la ruta correcta
    } catch (error) {
        console.error('Error al agregar el rol en el proyecto:', error);
        res.status(500).json({ error: 'Error al agregar el rol' });
    }
};

// Editar rol
exports.editarRol = async (req, res) => {
    const { id_rol } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/editar_rol/${id_rol}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Enviar el nuevo nombre del rol
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al editar el rol en el proyecto:', error);
        res.status(500).json({ error: 'Error al editar el rol' });
    }
};


// Eliminar rol
exports.eliminarRol = async (req, res) => {
    const { id_rol } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_rol/${id_rol}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar el rol en el proyecto:', error);
        res.status(500).json({ error: 'Error al eliminar el rol' });
    }
};


// Obtener todos los permisos
exports.traerPermisos = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_permisos`);
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Obtener permisos por rol
exports.traerPermisosPorRol = async (req, res, next) => {
    const rolId = req.params.rolId;
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_permisos_rol/${rolId}`);
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener permisos por rol:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.actualizarPermisosPorRol = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/actualizar_permisos`, { // Cambiado a puerto 4000
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar permisos en el proyecto:', error);
        res.status(500).json({ error: 'Error al actualizar permisos' });
    }
};

