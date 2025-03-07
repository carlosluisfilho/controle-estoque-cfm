const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/food_stock.db');

console.log("🔍 Verificando o banco de dados...");

// Criação de tabelas sem resetar os dados
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS donation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            donor_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(food_id) REFERENCES food(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS distribution (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            house_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(food_id) REFERENCES food(id)
        )
    `);

    console.log("✅ Banco de dados pronto (dados preservados)!");
});

module.exports = db;
