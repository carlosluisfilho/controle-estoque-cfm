// amazonq-ignore-next-line
const express = require('express');
const {
  gerarRelatorioDoacoesPDF,
  gerarRelatorioDoacoesExcel,
  gerarRelatorioDistribuicoesPDF,
  gerarRelatorioDistribuicoesExcel,
  gerarRelatorioFoodPDF,
  gerarRelatorioFoodExcel
} = require('../models/report');
const path = require('path');
// amazonq-ignore-next-line
const autenticarToken = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { reportLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ✅ Gerar Relatório PDF de Doações
router.get('/donations/pdf', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = './public/relatorio_doacoes.pdf';
  await gerarRelatorioDoacoesPDF(filePath);
  res.download(filePath);
}));

// ✅ Gerar Relatório Excel de Doações
router.get('/donations/excel', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = './public/relatorio_doacoes.xlsx';
  await gerarRelatorioDoacoesExcel(filePath);
  res.download(filePath);
}));

router.get('/distributions/pdf', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.pdf');
  await gerarRelatorioDistribuicoesPDF(filePath);
  res.download(filePath);
}));

router.get('/distributions/excel', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.xlsx');
  await gerarRelatorioDistribuicoesExcel(filePath);
  res.download(filePath);
}));

// ✅ Adiciona autenticação antes de gerar o relatório
router.get('/food/pdf', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_alimentos.pdf');
  await gerarRelatorioFoodPDF(filePath);
  res.download(filePath);
}));

// ✅ Adiciona autenticação antes de gerar o relatório Excel
router.get('/food/excel', reportLimiter, autenticarToken, asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_alimentos.xlsx');
  await gerarRelatorioFoodExcel(filePath);
  res.download(filePath);
}));



module.exports = router;
