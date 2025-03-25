const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'secreta';

function autenticarToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    console.log('Acesso negado: Token não fornecido');
    return res.status(401).json({ error: 'Acesso negado' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
}

module.exports = autenticarToken;
