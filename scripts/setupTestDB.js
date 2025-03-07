const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/test.db");

console.log("🗑️ Limpando banco de testes...");

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS food");
    db.run("DROP TABLE IF EXISTS donation");

    console.log("📦 Criando tabelas de teste...");

    db.run(`
        CREATE TABLE food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            quantity INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE donation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            donor_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (food_id) REFERENCES food(id)
        )
    `);

    console.log("🌱 Inserindo dados iniciais...");

    db.run("INSERT INTO food (name, quantity) VALUES ('Feijão', 50)");

    console.log("✅ Banco de testes configurado!");
});

db.close();