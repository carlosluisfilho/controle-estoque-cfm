// amazonq-ignore-next-line
const { validationResult } = require('express-validator');
const { sanitizeInput } = require('../utils/validationUtils');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
};

const sanitizeRequestBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }
  next();
};

const rateLimitByIP = new Map();

const preventBruteForce = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }
    
    const ip = req.ip;
    const now = Date.now();
    
    if (!rateLimitByIP.has(ip)) {
      rateLimitByIP.set(ip, { attempts: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = rateLimitByIP.get(ip);
    
    if (now > record.resetTime) {
      record.attempts = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.attempts >= maxAttempts) {
      return res.status(429).json({
        error: 'Muitas tentativas. Tente novamente em 15 minutos.'
      });
    }
    
    record.attempts++;
    next();
  };
};

module.exports = {
  handleValidationErrors,
  sanitizeRequestBody,
  preventBruteForce
};