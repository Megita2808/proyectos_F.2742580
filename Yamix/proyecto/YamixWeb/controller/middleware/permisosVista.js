
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


exports.attachUserPermissions = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.jwt) {
            // Decodificar el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // Llamar a la API para obtener los permisos del usuario
            const apiResponse = await fetch(`${process.env.pathApi}/get_permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.cookies.jwt}`
                },
                body: JSON.stringify({ id: decoded.id })
            });

            if (apiResponse.ok) {
                const userData = await apiResponse.json();
                if (userData && userData.permisos) {
                    req.usuario = { id: decoded.id, permisos: userData.permisos };
                } else {
                    console.log('Los permisos del usuario no se encontraron.');
                }
            } else {
                console.log('Error al obtener los permisos del usuario:', apiResponse.statusText);
            }
        }
        next();
    } catch (error) {
        console.log('Error en attachUserPermissions:', error);
        next();
    }
};