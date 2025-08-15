const { body, param } = require('express-validator');

const commonValidations = {
  foodId: body('food_id').isInt({ min: 1 }).withMessage('ID do alimento deve ser um número inteiro positivo'),
  quantity: body('quantity').isFloat({ gt: 0 }).withMessage('Quantidade deve ser maior que zero'),
  date: body('date').isISO8601().withMessage('Data deve estar no formato ISO8601'),
  reference: body('reference').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Referência deve ter entre 1 e 100 caracteres'),
  name: body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres').matches(/^[a-zA-Z0-9À-ÿ\s\-\_]+$/).withMessage('Nome deve conter apenas letras, números, espaços, hífens e underscores'),
  purchaseValue: body('purchase_value').isFloat({ min: 0 }).withMessage('Valor de compra deve ser um número positivo'),
  expiration: body('expiration').isISO8601().withMessage('Data de validade deve estar no formato ISO8601'),
  email: body('email').isEmail().normalizeEmail().withMessage('Email deve ter formato válido'),
  password: body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  donorName: body('donor_name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Nome do doador deve ter entre 2 e 100 caracteres'),
  id: param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo')
};

const sanitizers = {
  trimAndEscape: (field) => body(field).trim().escape(),
  normalizeEmail: (field) => body(field).normalizeEmail()
};

function validateRequired(value, fieldName) {
  if (!value || value.toString().trim() === '') {
    throw new Error(`${fieldName} é obrigatório`);
  }
}

function validatePositiveNumber(value, fieldName) {
  if (value <= 0) {
    throw new Error(`${fieldName} deve ser positivo`);
  }
}

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/[<>"']/g, '');
  }
  return input;
}

module.exports = { 
  commonValidations, 
  sanitizers,
  validateRequired, 
  validatePositiveNumber,
  sanitizeInput
};