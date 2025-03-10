// Importa os módulos necessários
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const db = require('../database/db');
const fs = require('fs');

/**
 * Função utilitária para consultar o banco de dados.
 * 
 * @param {string} sql - A consulta SQL a ser executada.
 * @returns {Promise<Array>} - Uma promessa que é resolvida com os resultados da consulta.
 */
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

/**
 * Função genérica para gerar PDFs.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o PDF será salvo.
 * @param {string} titulo - O título do relatório.
 * @param {Array<string>} colunas - As colunas do relatório.
 * @param {Array<Object>} dados - Os dados do relatório.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o PDF é gerado.
 */
async function gerarPDF(caminhoArquivo, titulo, colunas, dados) {
  const doc = new PDFDocument();
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

/**
 * Função genérica para gerar Excel.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o Excel será salvo.
 * @param {string} titulo - O título do relatório.
 * @param {Array<Object>} colunas - As colunas do relatório.
 * @param {Array<Object>} dados - Os dados do relatório.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o Excel é gerado.
 */
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

/**
 * Gera o relatório de doações em PDF.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o PDF será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o PDF é gerado.
 */
async function gerarRelatorioDoacoesPDF(caminhoArquivo) {
  try {
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
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de doações em PDF:", err.message);
  }
}

/**
 * Gera o relatório de doações em Excel.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o Excel será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o Excel é gerado.
 */
async function gerarRelatorioDoacoesExcel(caminhoArquivo) {
  try {
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
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de doações em Excel:", err.message);
  }
}

/**
 * Gera o relatório de distribuições em PDF.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o PDF será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o PDF é gerado.
 */
async function gerarRelatorioDistribuicoesPDF(caminhoArquivo) {
  try {
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
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de distribuições em PDF:", err.message);
  }
}

/**
 * Gera o relatório de distribuições em Excel.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o Excel será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o Excel é gerado.
 */
async function gerarRelatorioDistribuicoesExcel(caminhoArquivo) {
  try {
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
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de distribuições em Excel:", err.message);
  }
}

/**
 * Gera o relatório de alimentos em PDF.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o PDF será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o PDF é gerado.
 */
async function gerarRelatorioFoodPDF(caminhoArquivo) {
  try {
    const alimentos = await consultarBanco(`SELECT * FROM food`);

    const colunas = ['id', 'name', 'quantity'];
    await gerarPDF(caminhoArquivo, 'Relatório de Alimentos', colunas, alimentos);
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de alimentos em PDF:", err.message);
  }
}

/**
 * Gera o relatório de alimentos em Excel.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o Excel será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o Excel é gerado.
 */
async function gerarRelatorioFoodExcel(caminhoArquivo) {
  try {
    const alimentos = await consultarBanco(`SELECT * FROM food`);

    const colunas = [
      { header: 'ID', key: 'id' },
      { header: 'Nome', key: 'name' },
      { header: 'Quantidade', key: 'quantity' }
    ];
    await gerarExcel(caminhoArquivo, 'Relatório de Alimentos', colunas, alimentos);
  } catch (err) {
    console.error("❌ Erro ao gerar relatório de alimentos em Excel:", err.message);
  }
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