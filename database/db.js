const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? './database/test.db' : './database/food_stock.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log(`🔍 Conectado ao banco de dados: ${dbPath}`);
  }
});

function criarTabelas() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `, onError('users'));

    db.run(`
      CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        date TEXT,
        reference TEXT,
        purchase_value REAL,
        expiration TEXT,
        total REAL,
        month_reference TEXT
      )
    `, onError('food'));

    db.run(`
      CREATE TABLE IF NOT EXISTS donation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        donor_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(food_id) REFERENCES food(id)
      )
    `, onError('donation'));

    db.run(`
      CREATE TABLE IF NOT EXISTS distribution (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        house_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(food_id) REFERENCES food(id)
      )
    `, onError('distribution'));

    console.log('✅ Banco de dados pronto (dados preservados)!');
  });
}

function onError(tabela) {
  return (err) => {
    if (err) {
      console.error(`❌ Erro ao criar a tabela '${tabela}':`, err.message);
    }
  };
}

// Executar a criação das tabelas
criarTabelas();

module.exports = db;
