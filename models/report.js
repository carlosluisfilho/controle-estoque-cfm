const PDFDocument = require('pdfkit');
// amazonq-ignore-next-line
const ExcelJS = require('exceljs');
const db = require('../database/db');
const fs = require('fs');
const path = require('path');

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
  // Validar e normalizar caminho para prevenir path traversal
  const safePath = path.resolve('./public/', path.basename(caminhoArquivo));
  const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
  const stream = fs.createWriteStream(safePath);
  doc.pipe(stream);

  // Cabeçalho
  doc.fontSize(20).font('Helvetica-Bold')
     .text(titulo, { align: 'center' })
     .moveDown(2);

  // Data do relatório
  doc.fontSize(10).font('Helvetica')
     .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'right' })
     .moveDown();

  if (dados.length === 0) {
    doc.fontSize(12).text('Nenhum registro encontrado.', { align: 'center' });
    doc.end();
    return new Promise(resolve => stream.on('finish', resolve));
  }

  // Configuração da tabela
  const startX = 50;
  let currentY = doc.y + 20;
  const rowHeight = 25;
  const colWidths = calcularLarguraColunas(colunas, dados);

  // Cabeçalho da tabela
  doc.fontSize(10).font('Helvetica-Bold');
  desenharLinhaTabelaPDF(doc, startX, currentY, colunas, colWidths, true);
  currentY += rowHeight;

  // Linhas de dados
  doc.font('Helvetica');
  dados.forEach((item, index) => {
    if (currentY > 500) { // Nova página se necessário (paisagem)
      doc.addPage();
      currentY = 50;
      // Repetir cabeçalho na nova página
      doc.font('Helvetica-Bold');
      desenharLinhaTabelaPDF(doc, startX, currentY, colunas, colWidths, true);
      currentY += rowHeight;
      doc.font('Helvetica');
    }

    const valores = colunas.map(col => String(item[col] || ''));
    desenharLinhaTabelaPDF(doc, startX, currentY, valores, colWidths, false);
    currentY += rowHeight;
  });

  // Rodapé
  doc.fontSize(8).text(`Total de registros: ${dados.length}`, startX, currentY + 20);

  doc.end();
  return new Promise(resolve => stream.on('finish', resolve));
}

function calcularLarguraColunas(colunas, dados) {
  const pageWidth = 700; // Largura útil da página em paisagem
  const numCols = colunas.length;
  
  // Larguras específicas para diferentes tipos de relatório
  if (colunas.includes('Nome') && colunas.includes('Validade')) {
    // Relatório de alimentos - paisagem
    return [40, 120, 60, 80, 80, 80, 80, 80, 80]; // ID, Nome, Qtd, Data, Ref, Valor, Total, Mês, Validade
  } else if (colunas.includes('Alimento')) {
    // Relatórios de doação/distribuição - paisagem
    return [50, 200, 100, 200, 150]; // ID, Alimento, Qtd, Doador/Casa, Data
  }
  
  // Distribuição uniforme como fallback
  return Array(numCols).fill(pageWidth / numCols);
}

function desenharLinhaTabelaPDF(doc, startX, y, valores, larguras, isHeader) {
  let currentX = startX;
  
  valores.forEach((valor, index) => {
    const width = larguras[index];
    
    // Fundo para cabeçalho
    if (isHeader) {
      doc.rect(currentX, y - 5, width, 20).fill('#f0f0f0');
      doc.fillColor('#000000');
    }
    
    // Texto
    doc.text(String(valor), currentX + 5, y, {
      width: width - 10,
      height: 15,
      ellipsis: true
    });
    
    // Borda da célula
    doc.rect(currentX, y - 5, width, 20).stroke();
    
    currentX += width;
  });
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
      FROM donation JOIN food ON donation.food_id = food.id ORDER BY donation.created_at DESC
    `);
    doacoes = doacoes.map(d => ({
      'ID': d.id,
      'Alimento': d.food_name,
      'Quantidade': d.quantity,
      'Doador': d.donor_name || 'Anônimo',
      'Data': formatarData(d.created_at)
    }));
    const colunas = ['ID', 'Alimento', 'Quantidade', 'Doador', 'Data'];
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
    doacoes = doacoes.map(d => ({ ...d, created_at: formatarData(d.created_at) }));
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
      FROM distribution JOIN food ON distribution.food_id = food.id ORDER BY distribution.created_at DESC
    `);
    dist = dist.map(d => ({
      'ID': d.id,
      'Alimento': d.food_name,
      'Quantidade': d.quantity,
      'Casa': d.house_name,
      'Data': formatarData(d.created_at)
    }));
    const colunas = ['ID', 'Alimento', 'Quantidade', 'Casa', 'Data'];
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
    dist = dist.map(d => ({ ...d, created_at: formatarData(d.created_at) }));
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
    let alimentos = await consultarBanco(`SELECT * FROM food ORDER BY name`);
    alimentos = alimentos.map(a => ({
      'ID': a.id,
      'Nome': a.name,
      'Quantidade': a.quantity,
      'Data': formatarData(a.date),
      'Referência': a.reference,
      'Valor Compra': `R$ ${parseFloat(a.purchase_value || 0).toFixed(2)}`,
      'Total': `R$ ${parseFloat(a.total || 0).toFixed(2)}`,
      'Mês Ref.': a.month_reference,
      'Validade': formatarData(a.expiration)
    }));
    const colunas = [
      'ID', 'Nome', 'Quantidade', 'Data', 'Referência',
      'Valor Compra', 'Total', 'Mês Ref.', 'Validade'
    ];
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
      date: formatarData(a.date),
      expiration: formatarData(a.expiration),
      total: parseFloat(a.total || 0).toFixed(2)
    }));
    const colunas = [
      { header: 'ID', key: 'id' },
      { header: 'Nome', key: 'name' },
      { header: 'Quantidade', key: 'quantity' },
      { header: 'Data', key: 'date' },
      { header: 'Referência', key: 'reference' },
      { header: 'Valor da Compra', key: 'purchase_value' },
      { header: 'Total (R$)', key: 'total' },
      { header: 'Mês de Referência', key: 'month_reference' },
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
