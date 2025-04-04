// Importa os módulos necessários
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const db = require('../database/db'); // Conexão com o SQLite
const fs = require('fs');

/**
 * Gera o relatório em PDF.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o relatório será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o relatório é gerado.
 */
async function gerarRelatorioPDF(caminhoArquivo) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(caminhoArquivo);

  doc.pipe(stream);

  doc.fontSize(18).text('Relatório de Doações', { align: 'center' });
  doc.moveDown();

  try {
    const doacoes = await consultarDoacoes();
    doc.fontSize(12).text('ID | Alimento | Quantidade | Doador | Data');
    doc.moveDown();

    doacoes.forEach(doacao => {
      const linha = `${doacao.id} | ${doacao.food_name} | ${doacao.quantity} | ${doacao.donor_name || 'Anônimo'} | ${doacao.created_at}`;
      doc.text(linha);
    });

    doc.end();

    return new Promise(resolve => {
      stream.on('finish', resolve);
    });
  } catch (err) {
    console.error("❌ Erro ao gerar relatório PDF:", err.message);
  }
}

/**
 * Gera o relatório em Excel.
 * 
 * @param {string} caminhoArquivo - O caminho do arquivo onde o relatório será salvo.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o relatório é gerado.
 */
async function gerarRelatorioExcel(caminhoArquivo) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Relatório de Doações');

  // Cabeçalhos
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Alimento', key: 'food_name', width: 30 },
    { header: 'Quantidade', key: 'quantity', width: 15 },
    { header: 'Doador', key: 'donor_name', width: 25 },
    { header: 'Data', key: 'created_at', width: 25 }
  ];

  try {
    const doacoes = await consultarDoacoes();

    // Adicionar linhas
    doacoes.forEach(doacao => worksheet.addRow(doacao));

    await workbook.xlsx.writeFile(caminhoArquivo);
  } catch (err) {
    console.error("❌ Erro ao gerar relatório Excel:", err.message);
  }
}

/**
 * Consulta doações no banco de dados.
 * 
 * @returns {Promise<Array>} - Uma promessa que é resolvida com as doações consultadas.
 */
async function consultarDoacoes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM donation';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Exporta as funções para serem usadas em outras partes da aplicação
module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };