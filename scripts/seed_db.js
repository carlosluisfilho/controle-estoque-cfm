const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/food_stock.db');

db.serialize(() => {
    console.log('🚀 Inserindo carga inicial no banco de dados...');

    // Inserir Alimentos Iniciais
    const alimentos = [
        { name: 'Arroz', quantity: 100 },
        { name: 'Feijão', quantity: 80 },
        { name: 'Leite', quantity: 50 },
        { name: 'Macarrão', quantity: 60 },
        { name: 'Óleo', quantity: 40 },
        { name: 'Farinha', quantity: 30 }
    ];

    alimentos.forEach(alimento => {
        db.run(
            `INSERT INTO food (name, quantity) 
             SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM food WHERE name = ?)`,
            [alimento.name, alimento.quantity, alimento.name]
        );
    });
    
    console.log('✅ Carga inicial inserida com sucesso!');
});

db.close();
