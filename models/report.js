const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const db = require('../database/db');

// Função utilitária para consultar o banco de dados
async function consultarBanco(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Função genérica para gerar PDFs
async function gerarPDF(caminhoArquivo, titulo, colunas, dados) {
  const doc = new PDFDocument();
  const fs = require('fs');
  const stream = fs.createWriteStream(caminhoArquivo);

  doc.pipe(stream);
  doc.fontSize(18).text(titulo, { align: 'center' }).moveDown();

  doc.fontSize(12).text(colunas.join(' | '));
  doc.moveDown();

  dados.forEach(item => {
    const linha = colunas.map(col => item[col]).join(' | ');
    doc.text(linha);
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', resolve));
}

// Função genérica para gerar Excel
async function gerarExcel(caminhoArquivo, titulo, colunas, dados) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(titulo);

  worksheet.columns = colunas.map(coluna => ({
    header: coluna.header,
    key: coluna.key,
    width: coluna.width || 15
  }));

  dados.forEach(item => worksheet.addRow(item));

  await workbook.xlsx.writeFile(caminhoArquivo);
}

// Relatório de doações
async function gerarRelatorioDoacoesPDF(caminhoArquivo) {
  const doacoes = await consultarBanco(`
    SELECT 
      donation.id, 
      food.name AS food_name, 
      donation.quantity, 
      donation.donor_name, 
      donation.created_at
    FROM donation
    JOIN food ON donation.food_id = food.id
  `);

  const colunas = ['id', 'food_name', 'quantity', 'donor_name', 'created_at'];
  await gerarPDF(caminhoArquivo, 'Relatório de Doações', colunas, doacoes);
}

async function gerarRelatorioDoacoesExcel(caminhoArquivo) {
  const doacoes = await consultarBanco(`
    SELECT 
      donation.id, 
      food.name AS food_name, 
      donation.quantity, 
      donation.donor_name, 
      donation.created_at
    FROM donation
    JOIN food ON donation.food_id = food.id
  `);

  const colunas = [
    { header: 'ID', key: 'id' },
    { header: 'Alimento', key: 'food_name' },
    { header: 'Quantidade', key: 'quantity' },
    { header: 'Doador', key: 'donor_name' },
    { header: 'Data', key: 'created_at' }
  ];
  await gerarExcel(caminhoArquivo, 'Relatório de Doações', colunas, doacoes);
}

// Relatório de distribuições
async function gerarRelatorioDistribuicoesPDF(caminhoArquivo) {
  const distribuicoes = await consultarBanco(`
    SELECT 
      distribution.id, 
      food.name AS food_name, 
      distribution.quantity, 
      distribution.house_name, 
      distribution.created_at
    FROM distribution
    JOIN food ON distribution.food_id = food.id
  `);

  const colunas = ['id', 'food_name', 'quantity', 'house_name', 'created_at'];
  await gerarPDF(caminhoArquivo, 'Relatório de Distribuições', colunas, distribuicoes);
}

async function gerarRelatorioDistribuicoesExcel(caminhoArquivo) {
  const distribuicoes = await consultarBanco(`
    SELECT 
      distribution.id, 
      food.name AS food_name, 
      distribution.quantity, 
      distribution.house_name, 
      distribution.created_at
    FROM distribution
    JOIN food ON distribution.food_id = food.id
  `);

  const colunas = [
    { header: 'ID', key: 'id' },
    { header: 'Alimento', key: 'food_name' },
    { header: 'Quantidade', key: 'quantity' },
    { header: 'Casa Receptora', key: 'house_name' },
    { header: 'Data', key: 'created_at' }
  ];
  await gerarExcel(caminhoArquivo, 'Relatório de Distribuições', colunas, distribuicoes);
}

// Relatório de alimentos
async function gerarRelatorioFoodPDF(caminhoArquivo) {
  const alimentos = await consultarBanco(`SELECT * FROM food`);

  const colunas = ['id', 'name', 'quantity'];
  await gerarPDF(caminhoArquivo, 'Relatório de Alimentos', colunas, alimentos);
}

async function gerarRelatorioFoodExcel(caminhoArquivo) {
  const alimentos = await consultarBanco(`SELECT * FROM food`);

  const colunas = [
    { header: 'ID', key: 'id' },
    { header: 'Nome', key: 'name' },
    { header: 'Quantidade', key: 'quantity' }
  ];
  await gerarExcel(caminhoArquivo, 'Relatório de Alimentos', colunas, alimentos);
}

// Exportar funções
module.exports = {
  gerarRelatorioDoacoesPDF,
  gerarRelatorioDoacoesExcel,
  gerarRelatorioDistribuicoesPDF,
  gerarRelatorioDistribuicoesExcel,
  gerarRelatorioFoodPDF,
  gerarRelatorioFoodExcel
};
