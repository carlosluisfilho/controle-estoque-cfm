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
const autenticarToken = require('../middleware/auth'); // ✅ Importação correta do middleware

const router = express.Router();

// ✅ Gerar Relatório PDF de Doações
router.get('/donations/pdf', autenticarToken, async (req, res) => {
  try {
      const filePath = './public/relatorio_doacoes.pdf';
      await gerarRelatorioDoacoesPDF(filePath);
      res.download(filePath);
  } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório PDF.' });
  }
});

// ✅ Gerar Relatório Excel de Doações
router.get('/donations/excel', autenticarToken, async (req, res) => {
  try {
      const filePath = './public/relatorio_doacoes.xlsx';
      await gerarRelatorioDoacoesExcel(filePath);
      res.download(filePath);
  } catch (error) {
      console.error('Erro ao gerar relatório Excel:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório Excel.' });
  }
});

router.get('/distributions/pdf', async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.pdf');
  await gerarRelatorioDistribuicoesPDF(filePath);
  res.download(filePath);
});

router.get('/distributions/excel', async (req, res) => {
  const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.xlsx');
  await gerarRelatorioDistribuicoesExcel(filePath);
  res.download(filePath);
});

// ✅ Adiciona autenticação antes de gerar o relatório
router.get('/food/pdf', autenticarToken, async (req, res) => {
  try {
      const filePath = path.join(__dirname, '../public/relatorio_alimentos.pdf');
      await gerarRelatorioFoodPDF(filePath);
      res.download(filePath);
  } catch (error) {
      console.error('Erro ao gerar relatório de alimentos:', error);
      res.status(500).json({ error: 'Erro interno ao gerar relatório PDF.' });
  }
});

// ✅ Adiciona autenticação antes de gerar o relatório Excel
router.get('/food/excel', autenticarToken, async (req, res) => {
  try {
      const filePath = path.join(__dirname, '../public/relatorio_alimentos.xlsx');
      await gerarRelatorioFoodExcel(filePath);
      res.download(filePath); // 🔥 Envia o arquivo gerado para o usuário
  } catch (error) {
      console.error('Erro ao gerar relatório de alimentos:', error);
      res.status(500).json({ error: 'Erro interno ao gerar relatório Excel.' });
  }
});

// Função para construir a query dinâmica com filtros opcionais
async function consultarDoacoes(filtroData, filtroDoador, filtroAlimento) {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT donation.id, food.name AS food_name, donation.quantity, 
             donation.donor_name, donation.created_at 
      FROM donation 
      JOIN food ON donation.food_id = food.id
      WHERE 1=1
    `;
    
    let params = [];

    if (filtroData) {
      sql += " AND DATE(donation.created_at) = ?";
      params.push(filtroData);
    }
    
    if (filtroDoador) {
      sql += " AND donation.donor_name LIKE ?";
      params.push(`%${filtroDoador}%`);
    }

    if (filtroAlimento) {
      sql += " AND food.name LIKE ?";
      params.push(`%${filtroAlimento}%`);
    }

    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Rota para buscar doações filtradas
router.get('/donations', async (req, res) => {
  try {
    const { data, doador, alimento } = req.query;
    const doacoes = await consultarDoacoes(data, doador, alimento);
    res.json(doacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar doações.' });
  }
});

// Rota para gerar relatório PDF com filtros
router.get('/donations/pdf', async (req, res) => {
  try {
    const { data, doador, alimento } = req.query;
    const doacoes = await consultarDoacoes(data, doador, alimento);

    const caminhoArquivo = './public/relatorio_doacoes.pdf';
    await gerarRelatorioPDF(doacoes, caminhoArquivo);

    res.download(caminhoArquivo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório PDF.' });
  }
});

// Rota para gerar relatório Excel com filtros
router.get('/donations/excel', async (req, res) => {
  try {
    const { data, doador, alimento } = req.query;
    const doacoes = await consultarDoacoes(data, doador, alimento);

    const caminhoArquivo = './public/relatorio_doacoes.xlsx';
    await gerarRelatorioExcel(doacoes, caminhoArquivo);

    res.download(caminhoArquivo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório Excel.' });
  }
});

module.exports = router;
