// services/dashboardService.js
const db = require("../database/db");
const cache = require('../utils/cache');

const tabelasPermitidas = ["food", "donation", "distribution"];

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
}

async function contarRegistros(tabela) {
  if (!tabelasPermitidas.includes(tabela)) {
    throw new Error("Tabela inválida.");
  }
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS total FROM ${tabela}`, (err, row) => {
      if (err) reject(err);
      else resolve(row.total);
    });
  });
}

async function obterTotais() {
  const [alimentos, doacoes, distribuicoes] = await Promise.all([
    contarRegistros("food"),
    contarRegistros("donation"),
    contarRegistros("distribution"),
  ]);

  const result = {
    alimentos: alimentos || 0,
    doacoes: doacoes || 0,
    distribuicoes: distribuicoes || 0,
  };

  return result;
}

async function obterUltimasMovimentacoes() {
  const result = {
    alimentos: await buscarUltimosAlimentos(),
    doacoes: await buscarUltimasDoacoes(),
    distribuicoes: await buscarUltimasDistribuicoes(),
  };

  return result;
}

function buscarUltimosAlimentos() {
  const sql = `SELECT name, quantity, date as created_at FROM food ORDER BY date DESC LIMIT 5`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(row => ({ ...row, created_at: row.created_at || '-' })));
    });
  });
}

function buscarUltimasDoacoes() {
  const sql = `
    SELECT donation.quantity, donation.donor_name, food.name AS food_name, donation.created_at
    FROM donation
    JOIN food ON donation.food_id = food.id
    ORDER BY donation.created_at DESC
    LIMIT 5
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(row => ({ ...row, created_at: formatDate(row.created_at) })));
    });
  });
}

function buscarUltimasDistribuicoes() {
  const sql = `
    SELECT distribution.quantity, distribution.house_name, food.name AS food_name, distribution.created_at
    FROM distribution
    JOIN food ON distribution.food_id = food.id
    ORDER BY distribution.created_at DESC
    LIMIT 5
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(row => ({ ...row, created_at: formatDate(row.created_at) })));
    });
  });
}

module.exports = {
  obterTotais,
  obterUltimasMovimentacoes,
};
