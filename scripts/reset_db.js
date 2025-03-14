const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/food_stock.db');

db.serialize(() => {
  console.log('🚀 Resetando o banco de dados...');

  // Remover tabelas antigas
  db.run(`DROP TABLE IF EXISTS food`);
  db.run(`DROP TABLE IF EXISTS donation`);
  db.run(`DROP TABLE IF EXISTS distribution`);


  // Criar tabela de alimentos (Corrigindo para INTEGER)
  db.run(`
    CREATE TABLE food (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0 -- ✅ Garante que a quantidade seja um número
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

  // Inserir dados iniciais
  console.log('📥 Inserindo dados iniciais...');

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

  console.log('✅ Dados iniciais inseridos.');
});

db.close();