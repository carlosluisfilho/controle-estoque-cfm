const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Define o caminho do banco de dados de teste
const testDBPath = path.join(__dirname, '..', 'database', 'test.db');

// Remove o banco de teste antes de conectar
if (fs.existsSync(testDBPath)) {
  try {
    fs.unlinkSync(testDBPath);
    console.log('🗑️ Banco de testes anterior removido com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao remover banco de testes:', err.message);
    process.exit(1);
  }
}

// Garante o ambiente de teste
process.env.NODE_ENV = 'test';
const db = require('../database/db');

console.log('📦 Criando tabelas de teste...');

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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  console.log('✅ Todas as tabelas foram criadas.');

  // Insere usuário admin padrão, se necessário
  db.get(`SELECT COUNT(*) AS count FROM users WHERE username = ?`, ['admin'], (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar usuário:', err.message);
      process.exit(1);
    }

    if (row.count > 0) {
      console.log('ℹ️ Usuário admin já existe no banco de testes.');
      process.exit(0);
    }

    const hash = bcrypt.hashSync('123456', 10);
    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      ['admin', hash, 'admin'],
      (err) => {
        if (err) {
          console.error('❌ Erro ao inserir usuário admin:', err.message);
          process.exit(1);
        } else {
          console.log('✅ Usuário admin inserido com sucesso.');
          console.log('🎯 Banco de testes pronto para uso!');
          process.exit(0);
        }
      });
  });
});

function onError(tabela) {
  return (err) => {
    if (err) {
      console.error(`❌ Erro ao criar tabela '${tabela}':`, err.message);
    }
  };
}
