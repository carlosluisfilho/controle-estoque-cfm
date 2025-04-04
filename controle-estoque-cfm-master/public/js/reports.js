const {
  gerarRelatorioDoacoesPDF,
  gerarRelatorioDoacoesExcel,
  gerarRelatorioDistribuicoesPDF,
  gerarRelatorioDistribuicoesExcel,
  gerarRelatorioFoodPDF,
  gerarRelatorioFoodExcel,
  gerarRelatorioPDF,
  gerarRelatorioExcel
} = require('../models/report');
const path = require('path');
const autenticarToken = require('../middleware/auth');
const db = require('../database/db');

const router = express.Router();

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

router.get('/distributions/pdf', autenticarToken, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.pdf');
    await gerarRelatorioDistribuicoesPDF(filePath);
    res.download(filePath);
  } catch (error) {
    console.error('Erro ao gerar relatório de distribuições PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório PDF.' });
  }
});

router.get('/distributions/excel', autenticarToken, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/relatorio_distribuicoes.xlsx');
    await gerarRelatorioDistribuicoesExcel(filePath);
    res.download(filePath);
  } catch (error) {
    console.error('Erro ao gerar relatório de distribuições Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório Excel.' });
  }
});

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

router.get('/food/excel', autenticarToken, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/relatorio_alimentos.xlsx');
    await gerarRelatorioFoodExcel(filePath);
    res.download(filePath);
  } catch (error) {
    console.error('Erro ao gerar relatório de alimentos:', error);
    res.status(500).json({ error: 'Erro interno ao gerar relatório Excel.' });
  }
});

async function consultarDoacoes(filtroData, filtroDoador, filtroAlimento) {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT donation.id, food.name AS food_name, donation.quantity, 
             donation.donor_name, donation.created_at,
             donation.expiration_date, donation.donated_at
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

router.get('/donations', autenticarToken, async (req, res) => {
  try {
    const { data, doador, alimento } = req.query;
    const doacoes = await consultarDoacoes(data, doador, alimento);
    res.json(doacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar doações.' });
  }
});

router.get('/donations/pdf', autenticarToken, async (req, res) => {
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

router.get('/donations/excel', autenticarToken, async (req, res) => {
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