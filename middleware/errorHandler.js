// amazonq-ignore-next-line
const logger = require('../utils/logger');
const alertService = require('../services/alertService');

// Middleware para tratamento centralizado de erros
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function errorHandler(err, req, res, next) {
  const context = {
    url: req.url,
    method: req.method,
    ip: req.ip,
    statusCode: err.statusCode
  };
  
  // Não logar erros 404 ou erros de teste em ambiente de teste
  const isTestError = process.env.NODE_ENV === 'test' && 
    (err.statusCode === 404 || err.message === 'Erro de teste' || err.message === 'Erro com status');
  
  if (!isTestError) {
    logger.error('Erro na aplicação', {
      message: err.message,
      stack: err.stack,
      ...context
    });
  }
  
  // Rastrear erro e enviar alerta se crítico
  alertService.trackError(err, context);
  
  if (err.statusCode >= 500 || !err.statusCode) {
    alertService.sendCriticalAlert(err, context);
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({ error: message });
}

module.exports = { asyncHandler, errorHandler };