const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;  // Asegúrate de tener cookies configuradas

    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error('Error de verificación del token:', err);
            return res.status(401).json({ message: 'Token no válido' });
        }

        // Verifica que el token tenga el nombre del rol
        const nombre_rol = decodedToken.rol;

        if (!nombre_rol) {
            return res.status(403).json({ message: 'Rol no encontrado en el token' });
        }

        // Guardar el nombre del rol en req.usuario
        req.usuario = {
            id_usuario: decodedToken.id,
            rol: nombre_rol,
        };
        req.token = token;
        next();
    });
};
