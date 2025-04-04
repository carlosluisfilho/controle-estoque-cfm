const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/food_stock.db');

db.serialize(() => {
  console.log('🚀 Resetando o banco de dados...');

  // Apagar tabelas antigas
  db.run(`DROP TABLE IF EXISTS food`);
  db.run(`DROP TABLE IF EXISTS donation`);
  db.run(`DROP TABLE IF EXISTS distribution`);

  // Criar tabela de alimentos
  db.run(`
    CREATE TABLE food (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      date TEXT,
      reference TEXT,
      purchase_value REAL,
      expiration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criar tabela de doações com validade e data da doação
  db.run(`
    CREATE TABLE donation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      donor_name TEXT,
      expiration TEXT,        -- Validade do item doado
      donation_date TEXT,     -- Data da doação
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(food_id) REFERENCES food(id)
    )
  `);

  // Criar tabela de distribuições
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

  // Inserir dados iniciais em food
  const stmtFood = db.prepare(`
    INSERT INTO food (name, quantity, date, reference, purchase_value, expiration)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const alimentos = [
    ['Arroz', 50, '2025-04-01', 'REF001', 120.5, '2026-04-01'],
    ['Feijão', 40, '2025-03-20', 'REF002', 95.8, '2026-03-20'],
    ['Macarrão', 30, '2025-03-15', 'REF003', 70.0, '2026-03-15'],
    ['Açúcar', 20, '2025-02-28', 'REF004', 65.2, '2026-02-28'],
    ['Sal', 10, '2025-01-10', 'REF005', 30.0, '2026-01-10']
  ];
  alimentos.forEach(([name, quantity, date, reference, purchase_value, expiration]) => {
    stmtFood.run(name, quantity, date, reference, purchase_value, expiration);
  });
  stmtFood.finalize();
  console.log('📥 Alimentos inseridos com sucesso.');

  // Inserir dados de doações
  const stmtDonation = db.prepare(`
    INSERT INTO donation (food_id, quantity, donor_name, expiration, donation_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  const doacoes = [
    [1, 10, 'João da Silva', '2026-04-01', '2025-04-01'],
    [2, 5, 'Maria Oliveira', '2026-03-20', '2025-03-21'],
    [3, 8, 'Carlos Lima', '2026-03-15', '2025-03-16'],
    [4, 4, 'Ana Paula', '2026-02-28', '2025-02-28'],
    [5, 3, 'Fernando Souza', '2026-01-10', '2025-01-11']
  ];
  doacoes.forEach(([food_id, quantity, donor_name, expiration, donation_date]) => {
    stmtDonation.run(food_id, quantity, donor_name, expiration, donation_date);
  });
  stmtDonation.finalize();
  console.log('📥 Doações inseridas com sucesso.');

  // Inserir dados de distribuições
  const stmtDistrib = db.prepare(`
    INSERT INTO distribution (food_id, quantity, house_name)
    VALUES (?, ?, ?)
  `);
  const distribuicoes = [
    [1, 5, 'Casa Esperança'],
    [2, 3, 'Lar São José'],
    [3, 4, 'Abrigo Luz'],
    [4, 2, 'Casa Nova'],
    [5, 1, 'Projeto Vida']
  ];
  distribuicoes.forEach(([food_id, quantity, house_name]) => {
    stmtDistrib.run(food_id, quantity, house_name);
  });
  stmtDistrib.finalize();
  console.log('📥 Distribuições inseridas com sucesso.');

  console.log('✅ Banco de dados pronto!');
});

db.close();
