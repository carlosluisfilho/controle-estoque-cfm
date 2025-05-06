const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const db = require('../database/db');
const fs = require('fs');

function formatarData(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`; // Formato DD-MM-AAAA
}

async function consultarBanco(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function gerarPDF(caminhoArquivo, titulo, colunas, dados) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(caminhoArquivo);

  doc.pipe(stream);
  doc.fontSize(18).text(titulo, { align: 'center' }).moveDown();
  doc.fontSize(12).text(colunas.join(' | ')).moveDown();

  dados.forEach(item => {
    const linha = colunas.map(col => item[col]).join(' | ');
    doc.text(linha);
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', resolve));
}

async function gerarExcel(caminhoArquivo, titulo, colunas, dados) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(titulo);

  worksheet.columns = colunas;
  dados.forEach(item => worksheet.addRow(item));

  await workbook.xlsx.writeFile(caminhoArquivo);
}

async function gerarRelatorioDoacoesPDF(caminho) {
  try {
    let doacoes = await consultarBanco(`
      SELECT donation.id, food.name AS food_name, donation.quantity, donation.donor_name, donation.created_at
      FROM donation JOIN food ON donation.food_id = food.id
    `);
    doacoes = doacoes.map(d => ({ ...d, created_at: formatarData(d.created_at) })); // Formatar data
    const colunas = ['id', 'food_name', 'quantity', 'donor_name', 'created_at'];
    await gerarPDF(caminho, 'Relatório de Doações', colunas, doacoes);
  } catch (err) {
    console.error("Erro PDF Doações:", err.message);
  }
}

async function gerarRelatorioDoacoesExcel(caminho) {
  try {
    let doacoes = await consultarBanco(`
      SELECT donation.id, food.name AS food_name, donation.quantity, donation.donor_name, donation.created_at
      FROM donation JOIN food ON donation.food_id = food.id
    `);
    doacoes = doacoes.map(d => ({ ...d, created_at: formatarData(d.created_at) })); // Formatar data
    const colunas = [
      { header: 'ID', key: 'id' },
      { header: 'Alimento', key: 'food_name' },
      { header: 'Quantidade', key: 'quantity' },
      { header: 'Doador', key: 'donor_name' },
      { header: 'Data', key: 'created_at' }
    ];
    await gerarExcel(caminho, 'Relatório de Doações', colunas, doacoes);
  } catch (err) {
    console.error("Erro Excel Doações:", err.message);
  }
}

async function gerarRelatorioDistribuicoesPDF(caminho) {
  try {
    let dist = await consultarBanco(`
      SELECT distribution.id, food.name AS food_name, distribution.quantity, distribution.house_name, distribution.created_at
      FROM distribution JOIN food ON distribution.food_id = food.id
    `);
    dist = dist.map(d => ({ ...d, created_at: formatarData(d.created_at) })); // Formatar data
    const colunas = ['id', 'food_name', 'quantity', 'house_name', 'created_at'];
    await gerarPDF(caminho, 'Relatório de Distribuições', colunas, dist);
  } catch (err) {
    console.error("Erro PDF Distribuições:", err.message);
  }
}

async function gerarRelatorioDistribuicoesExcel(caminho) {
  try {
    let dist = await consultarBanco(`
      SELECT distribution.id, food.name AS food_name, distribution.quantity, distribution.house_name, distribution.created_at
      FROM distribution JOIN food ON distribution.food_id = food.id
    `);
    dist = dist.map(d => ({ ...d, created_at: formatarData(d.created_at) })); // Formatar data
    const colunas = [
      { header: 'ID', key: 'id' },
      { header: 'Alimento', key: 'food_name' },
      { header: 'Quantidade', key: 'quantity' },
      { header: 'Casa Receptora', key: 'house_name' },
      { header: 'Data', key: 'created_at' }
    ];
    await gerarExcel(caminho, 'Relatório de Distribuições', colunas, dist);
  } catch (err) {
    console.error("Erro Excel Distribuições:", err.message);
  }
}

async function gerarRelatorioFoodPDF(caminho) {
  try {
    let alimentos = await consultarBanco(`SELECT * FROM food`);
    alimentos = alimentos.map(a => ({
      ...a,
      date: formatarData(a.date), // Formatar data
      expiration: formatarData(a.expiration) // Formatar data
    }));
    const colunas = ['id', 'name', 'quantity', 'date', 'reference', 'purchase_value', 'expiration'];
    await gerarPDF(caminho, 'Relatório de Alimentos', colunas, alimentos);
  } catch (err) {
    console.error("Erro PDF Alimentos:", err.message);
  }
}

async function gerarRelatorioFoodExcel(caminho) {
  try {
    let alimentos = await consultarBanco(`SELECT * FROM food`);
    alimentos = alimentos.map(a => ({
      ...a,
      date: formatarData(a.date), // Formatar data
      expiration: formatarData(a.expiration) // Formatar data
    }));
    const colunas = [
      { header: 'ID', key: 'id' },
      { header: 'Nome', key: 'name' },
      { header: 'Quantidade', key: 'quantity' },
      { header: 'Data', key: 'date' },
      { header: 'Referência', key: 'reference' },
      { header: 'Valor da Compra', key: 'purchase_value' },
      { header: 'Validade', key: 'expiration' }
    ];
    await gerarExcel(caminho, 'Relatório de Alimentos', colunas, alimentos);
  } catch (err) {
    console.error("Erro Excel Alimentos:", err.message);
  }
}

module.exports = {
  gerarRelatorioDoacoesPDF,
  gerarRelatorioDoacoesExcel,
  gerarRelatorioDistribuicoesPDF,
  gerarRelatorioDistribuicoesExcel,
  gerarRelatorioFoodPDF,
  gerarRelatorioFoodExcel
};
