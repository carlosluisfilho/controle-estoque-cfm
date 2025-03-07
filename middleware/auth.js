const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado' });
    }

    jwt.verify(token.replace('Bearer ', ''), 'secreta', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

module.exports = autenticarToken;
