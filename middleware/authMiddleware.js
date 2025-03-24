const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY ;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera formato "Bearer <token>"

    if (!token) return res.status(403).json({ message: 'Acceso denegado: token no proporcionado' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
        req.user = user; // Agregar los datos del usuario al request
        next();
    });
};

module.exports = { authenticateToken };
