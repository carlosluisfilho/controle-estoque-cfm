const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Caminho do banco de dados de teste
const testDBPath = path.join(__dirname, '..', 'database', 'test.db');

// Remove o banco anterior se existir
if (fs.existsSync(testDBPath)) {
  try {
    fs.unlinkSync(testDBPath);
    console.log('🗑️ Banco de testes anterior removido com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao remover banco de testes:', err.message);
    process.exit(1);
  }
}

// Define ambiente de teste
process.env.NODE_ENV = 'test';
const db = require('../database/db');

console.log('📦 Criando tabelas de teste...');

db.serialize(() => {
  console.log('🚀 Resetando o banco de dados...');

  // Apagar tabelas antigas
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS food`);
  db.run(`DROP TABLE IF EXISTS donation`);
  db.run(`DROP TABLE IF EXISTS distribution`);

  // Criar tabelas
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE food (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      date TEXT,
      reference TEXT,
      purchase_value REAL,
      total REAL,
      month_reference TEXT,
      expiration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE donation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      donor_name TEXT,
      reference TEXT,
      expiration TEXT,
      donation_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(food_id) REFERENCES food(id)
    )
  `);

  db.run(`
    CREATE TABLE distribution (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      house_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(food_id) REFERENCES food(id)
    )
  `);

  console.log('✅ Tabelas criadas com sucesso!');

  // Inserir usuário admin padrão
  const hash = bcrypt.hashSync('123456', 10);
  db.run(`
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `, ['admin', hash, 'admin'], (err) => {
    if (err) {
      console.error('❌ Erro ao inserir usuário admin:', err.message);
    } else {
      console.log('✅ Usuário admin inserido com sucesso.');

      // Validar inserção
      db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
        if (err || !row) {
          console.error('❌ Validação falhou: Usuário admin não encontrado.');
        } else {
          console.log('🔎 Validação OK: Usuário admin localizado no banco.');
        }
      });
    }
  });

  // Inserir dados iniciais em food
  const stmtFood = db.prepare(`
    INSERT INTO food (name, quantity, date, reference, purchase_value, total, month_reference, expiration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const alimentos = [
    ['Arroz', 50, '2025-04-01', 'Kilos', 120.5, 50 * 120.5, '2025-04', '2026-04-01'],
    ['Feijão', 40, '2025-03-20', 'Fardo', 95.8, 40 * 95.8, '2025-03', '2026-03-20'],
    ['Feijão Teste', 200, '2025-01-04', 'Unidade', 10.0, 2000, '2025-01', '2026-01-01'],
    ['Macarrão', 30, '2025-03-15', 'Pacotes', 70.0, 2100, '2025-03', '2026-03-15'],
    ['Açúcar', 20, '2025-02-28', 'Kilos', 65.2, 1304, '2025-02', '2026-02-28'],
    ['Sal', 10, '2025-01-10', 'Kilos', 30.0, 300, '2025-01', '2026-01-10']
  ];

  alimentos.forEach(([name, quantity, date, reference, purchase_value, total, month_reference, expiration]) => {
    stmtFood.run(name, quantity, date, reference, purchase_value, total, month_reference, expiration);
  });
  stmtFood.finalize(() => {
    db.get('SELECT * FROM food WHERE name = ?', ['Feijão Teste'], (err, row) => {
      if (err || !row) {
        console.error('❌ Validação falhou: Feijão Teste não encontrado.');
      } else {
        console.log('🔎 Validação OK: Feijão Teste inserido com sucesso.');
      }
    });
    console.log('📥 Alimentos inseridos com sucesso.');
  });

  // Inserir doações
  const stmtDonation = db.prepare(`
    INSERT INTO donation (food_id, quantity, donor_name, reference, expiration, donation_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const doacoes = [
    [1, 10, 'João da Silva', 'Kilos', '2026-04-01', '2025-04-01'],
    [2, 5, 'Maria Oliveira', 'Fardo', '2026-03-20', '2025-03-21'],
    [3, 20, 'Doador 1', 'Unidade', '2026-01-01', '2025-01-04']
  ];

  doacoes.forEach(([food_id, quantity, donor_name, reference, expiration, donation_date]) => {
    stmtDonation.run(food_id, quantity, donor_name, reference, expiration, donation_date);
  });
  stmtDonation.finalize(() => {
    // amazonq-ignore-next-line
    db.all('SELECT COUNT(*) as total FROM donation', (err, rows) => {
      if (err) {
        console.error('❌ Validação falhou: erro ao contar doações.');
      } else {
        console.log(`🔎 Validação OK: ${rows[0].total} doações inseridas.`);
      }
    });
    console.log('📥 Doações inseridas com sucesso.');
  });

  // Inserir distribuições
  const stmtDistrib = db.prepare(`
    INSERT INTO distribution (food_id, quantity, house_name)
    VALUES (?, ?, ?)
  `);

  const distribuicoes = [
    [1, 5, 'Casa Esperança'],
    [2, 3, 'Lar São José'],
    [3, 10, 'Casa Teste']
  ];

  distribuicoes.forEach(([food_id, quantity, house_name]) => {
    stmtDistrib.run(food_id, quantity, house_name);
  });

  stmtDistrib.finalize(() => {
    db.all('SELECT COUNT(*) as total FROM distribution', (err, rows) => {
      if (err) {
        console.error('❌ Validação falhou: erro ao contar distribuições.');
      } else {
        console.log(`🔎 Validação OK: ${rows[0].total} distribuições inseridas.`);
      }
    });
    console.log('📥 Distribuições inseridas com sucesso.');
    console.log('✅ Banco de dados pronto!');
    db.close();
  });
});