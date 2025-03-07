const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const db = require('../database/db'); // Conexão com o SQLite

// Gera o relatório em PDF
async function gerarRelatorioPDF(caminhoArquivo) {
  const doc = new PDFDocument();
  const fs = require('fs');
  const stream = fs.createWriteStream(caminhoArquivo);

  doc.pipe(stream);

  doc.fontSize(18).text('Relatório de Doações', { align: 'center' });
  doc.moveDown();

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
}

// Gera o relatório em Excel
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

  const doacoes = await consultarDoacoes();

  // Adicionar linhas
  doacoes.forEach(doacao => worksheet.addRow(doacao));

  await workbook.xlsx.writeFile(caminhoArquivo);
}

// Consulta doações no banco de dados
async function consultarDoacoes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM doacoes';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };
