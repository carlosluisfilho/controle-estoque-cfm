// routes/donation.js (refatorado)
const express = require('express');
const { body, validationResult } = require('express-validator');
const autenticarToken = require('../middleware/auth');
const donationService = require('../services/donationService');

const router = express.Router();

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

// ✅ Criar uma nova doação
router.post(
  '/',
  autenticarToken,
  body('food_id').isInt({ min: 1 }),
  body('quantity').isFloat({ gt: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const donation = await donationService.criarDoacao(req.body);
      return res.status(201).json({
        ...donation,
        expiration: formatDate(donation.expiration),
        donation_date: formatDate(donation.donation_date),
      });
    } catch (err) {
      console.error('🔥 Erro ao registrar doação:', err.message);
      return res.status(500).json({ error: 'Erro ao registrar doação.' });
    }
  }
);

// ✅ Listar doações
router.get('/', autenticarToken, async (req, res) => {
  try {
    const doacoes = await donationService.listarDoacoes();
    return res.json(
      doacoes.map((row) => ({
        ...row,
        expiration: formatDate(row.expiration),
        donation_date: formatDate(row.donation_date),
      }))
    );
  } catch (err) {
    console.error('❌ Erro ao buscar doações:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar doações.' });
  }
});

// ✅ Remover doação
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    await donationService.removerDoacao(parseInt(req.params.id, 10));
    return res.json({ message: 'Doação removida com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao excluir doação:', err.message);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ✅ Atualizar doação
router.put(
  '/:id',
  autenticarToken,
  body('food_id').isInt({ min: 1 }),
  body('quantity').isFloat({ gt: 0 }),
  body('donor_name').notEmpty(),
  body('reference').notEmpty(),
  body('donation_date').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await donationService.atualizarDoacao(parseInt(req.params.id, 10), req.body);
      return res.json({ message: 'Doação atualizada com sucesso.' });
    } catch (err) {
      console.error('❌ Erro ao atualizar doação:', err.message);
      return res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
);

module.exports = router;