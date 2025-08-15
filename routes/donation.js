// routes/donation.js (refatorado)
const express = require('express');
const { body } = require('express-validator');
const autenticarToken = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { handleValidationErrors, sanitizeRequestBody } = require('../middleware/validation');
const donationService = require('../services/donationService');
const { formatDate } = require('../utils/dateUtils');
const { commonValidations } = require('../utils/validationUtils');

const router = express.Router();

// ✅ Criar uma nova doação
router.post(
  '/',
  autenticarToken,
  sanitizeRequestBody,
  commonValidations.foodId,
  commonValidations.quantity,
  commonValidations.donorName,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const donation = await donationService.criarDoacao(req.body);
    return res.status(201).json({
      ...donation,
      expiration: formatDate(donation.expiration),
      donation_date: formatDate(donation.donation_date),
    });
  })
);

// ✅ Listar doações
router.get('/', autenticarToken, asyncHandler(async (req, res) => {
  const doacoes = await donationService.listarDoacoes();
  return res.json(
    doacoes.map((row) => ({
      ...row,
      expiration: formatDate(row.expiration),
      donation_date: formatDate(row.donation_date),
    }))
  );
}));

// ✅ Remover doação
router.delete('/:id', autenticarToken, asyncHandler(async (req, res) => {
  await donationService.removerDoacao(parseInt(req.params.id, 10));
  return res.json({ message: 'Doação removida com sucesso.' });
}));

// ✅ Atualizar doação
router.put(
  '/:id',
  autenticarToken,
  sanitizeRequestBody,
  commonValidations.id,
  commonValidations.foodId,
  commonValidations.quantity,
  commonValidations.donorName,
  commonValidations.reference,
  body('donation_date').isISO8601().withMessage('Data de doação inválida'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    await donationService.atualizarDoacao(parseInt(req.params.id, 10), req.body);
    return res.json({ message: 'Doação atualizada com sucesso.' });
  })
);

module.exports = router;