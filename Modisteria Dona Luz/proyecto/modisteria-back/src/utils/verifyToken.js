const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-token'];

    if (!token) return res.status(401).json({ msg: 'No han proporcionado el token' });

    jwt.verify(token, process.env.KEY_JWT, (err, { payload }) => {
        if (err) return res.status(401).json({ msg: payload });
        if (payload) {  
            req.id = payload.id;
            req.email = payload.email;
            req.roleId = payload.roleId;
            next();
        }
    });
}