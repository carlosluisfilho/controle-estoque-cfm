// routes/dashboard.js (refatorado)
const express = require("express");
const autenticarToken = require("../middleware/auth");
const dashboardService = require("../services/dashboardService");

const router = express.Router();

router.get("/", autenticarToken, async (req, res) => {
  try {
    const totais = await dashboardService.obterTotais();
    const ultimasMovimentacoes = await dashboardService.obterUltimasMovimentacoes();

    res.json({
      totais,
      ultimasMovimentacoes,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do painel:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados do painel." });
  }
});

module.exports = router;