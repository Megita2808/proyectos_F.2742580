// const jwt = require('jsonwebtoken');

// const validarJWT = (req, res, next) => {
//     const token = req.header('x-token');

//     if (!token) {
//         return res.status(401).json({
//             ok: false,
//             msg: 'No hay token en la petición'
//         });
//     }

//     try {
//         const { uid } = jwt.verify(token, process.env.JWT_SECRET);
//         req.uid = uid;
//         next();
//     } catch (error) {
//         console.error('Error al verificar el token:', error);
//         return res.status(401).json({
//             ok: false,
//             msg: 'Token no válido'
//         });
//     }
// };
// const generarJWT = (uid) => {
//     return new Promise((resolve, reject) => {
//         const payload = { uid };

//         jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn: '4h'
//         }, (err, token) => {
//             if (err) {
//                 console.error(err);
//                 reject('No se pudo generar el token');
//             } else {
//                 resolve(token);
//             }
//         });
//     });
// };

// module.exports = { generarJWT, validarJWT };

