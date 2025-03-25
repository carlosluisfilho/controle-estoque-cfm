const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/food_stock.db');

db.serialize(() => {
  console.log('🚀 Resetando o banco de dados...');

  // Remover tabelas antigas
  db.run(`DROP TABLE IF EXISTS food`);
  db.run(`DROP TABLE IF EXISTS donation`);
  db.run(`DROP TABLE IF EXISTS distribution`);

  // Criar tabela de alimentos
  db.run(`
    CREATE TABLE food (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criar tabela de doações
  db.run(`
    CREATE TABLE donation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      donor_name TEXT,
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

  console.log('✅ Banco de dados recriado com sucesso!');

  // Inserir alimentos iniciais
  console.log('📥 Inserindo dados iniciais de alimentos...');
  const stmtFood = db.prepare("INSERT INTO food (name, quantity) VALUES (?, ?)");
  const alimentos = [
    ['Arroz', 50],
    ['Feijão', 40],
    ['Macarrão', 30],
    ['Açúcar', 20],
    ['Sal', 10]
  ];
  alimentos.forEach(([name, quantity]) => {
    stmtFood.run(name, quantity);
  });
  stmtFood.finalize();

  // Inserir doações
  console.log('📥 Inserindo doações...');
  const stmtDonation = db.prepare("INSERT INTO donation (food_id, quantity, donor_name) VALUES (?, ?, ?)");
  const doacoes = [
    [1, 10, 'João da Silva'],
    [2, 5, 'Maria Oliveira'],
    [3, 8, 'Carlos Lima'],
    [4, 4, 'Ana Paula'],
    [5, 3, 'Fernando Souza']
  ];
  doacoes.forEach(([food_id, quantity, donor_name]) => {
    stmtDonation.run(food_id, quantity, donor_name);
  });
  stmtDonation.finalize();

  // Inserir distribuições
  console.log('📥 Inserindo distribuições...');
  const stmtDistrib = db.prepare("INSERT INTO distribution (food_id, quantity, house_name) VALUES (?, ?, ?)");
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

  console.log('✅ Dados iniciais de doações e distribuições inseridos.');
});

db.close();
