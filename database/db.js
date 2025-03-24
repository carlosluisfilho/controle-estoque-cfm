// Importa o módulo sqlite3 e habilita o modo verbose para obter mais informações de depuração
const sqlite3 = require('sqlite3').verbose();

// Cria uma nova instância do banco de dados SQLite, conectando-se ao arquivo 'food_stock.db'
const db = new sqlite3.Database('./database/food_stock.db', (err) => {
    // if (err) {
    //     console.error("❌ Erro ao conectar ao banco de dados:", err.message);
    // } else {
    //     console.log("🔍 Verificando o banco de dados...");
    //}
});

// Criação de tabelas sem resetar os dados
db.serialize(() => {
    // Cria a tabela 'users' se ela não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("❌ Erro ao criar a tabela 'users':", err.message);
        }
    });

    // Cria a tabela 'food' se ela não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("❌ Erro ao criar a tabela 'food':", err.message);
        }
    });

    // Cria a tabela 'donation' se ela não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS donation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            donor_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(food_id) REFERENCES food(id)
        )
    `, (err) => {
        if (err) {
            console.error("❌ Erro ao criar a tabela 'donation':", err.message);
        }
    });

    // Cria a tabela 'distribution' se ela não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS distribution (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            house_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(food_id) REFERENCES food(id)
        )
    `, (err) => {
        if (err) {
            console.error("❌ Erro ao criar a tabela 'distribution':", err.message);
        }
    });

    console.log("✅ Banco de dados pronto (dados preservados)!");
});

// Exporta a instância do banco de dados para ser usada em outras partes da aplicação
module.exports = db;