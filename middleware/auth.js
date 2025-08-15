const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  logger.error('JWT_SECRET não configurado nas variáveis de ambiente');
  process.exit(1);
}

function autenticarToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    // Não logar warnings para testes de segurança em ambiente de teste
    if (process.env.NODE_ENV !== 'test') {
      logger.warn('Tentativa de acesso sem token', { ip: req.ip, url: req.url });
    }
    return res.status(401).json({ error: 'Acesso negado' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // Não logar warnings para testes de segurança em ambiente de teste
      if (process.env.NODE_ENV !== 'test') {
        logger.warn('Token inválido', { error: err.message, ip: req.ip, url: req.url });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
}

module.exports = autenticarToken;
