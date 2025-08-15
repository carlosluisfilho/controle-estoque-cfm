const rateLimit = require('express-rate-limit');

// Rate limiter geral
const generalLimiter = process.env.NODE_ENV === 'test' ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para login (mais restritivo)
const loginLimiter = process.env.NODE_ENV === 'test' ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para relatórios (mais restritivo)
const reportLimiter = process.env.NODE_ENV === 'test' ? (req, res, next) => next() : rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 relatórios por IP
  message: { error: 'Muitos relatórios gerados. Tente novamente em 5 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, loginLimiter, reportLimiter };