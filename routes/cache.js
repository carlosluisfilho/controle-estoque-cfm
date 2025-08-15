const express = require('express');
const cache = require('../utils/cache');
const router = express.Router();

// Limpar cache
router.delete('/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache limpo com sucesso' });
});

// Estatísticas do cache
router.get('/stats', (req, res) => {
  const stats = {
    size: cache.cache.size,
    keys: Array.from(cache.cache.keys())
  };
  res.json(stats);
});

module.exports = router;