// routes/dashboard.js (refatorado)
const express = require("express");
const autenticarToken = require("../middleware/auth");
// amazonq-ignore-next-line
const { asyncHandler } = require('../middleware/errorHandler');
const dashboardService = require("../services/dashboardService");

const router = express.Router();

router.get("/", autenticarToken, asyncHandler(async (req, res) => {
  const totais = await dashboardService.obterTotais();
  const ultimasMovimentacoes = await dashboardService.obterUltimasMovimentacoes();

  res.json({
    totais,
    ultimasMovimentacoes,
  });
}));

module.exports = router;