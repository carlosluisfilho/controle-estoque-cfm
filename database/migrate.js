const db = require('./db');

function migrarTabelas() {
  console.log('🔄 Iniciando migração do banco de dados...');
  
  db.serialize(() => {
    // Adicionar colunas que podem estar faltando na tabela food
    const alterQueries = [
      'ALTER TABLE food ADD COLUMN date TEXT',
      'ALTER TABLE food ADD COLUMN reference TEXT', 
      'ALTER TABLE food ADD COLUMN purchase_value REAL',
      'ALTER TABLE food ADD COLUMN expiration TEXT',
      'ALTER TABLE food ADD COLUMN total REAL',
      'ALTER TABLE food ADD COLUMN month_reference TEXT'
    ];

    alterQueries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`❌ Erro na migração ${index + 1}:`, err.message);
        } else if (!err) {
          console.log(`✅ Migração ${index + 1} aplicada com sucesso`);
        }
      });
    });

    console.log('✅ Migração concluída!');
  });
}

if (require.main === module) {
  migrarTabelas();
  setTimeout(() => process.exit(0), 1000);
}

module.exports = { migrarTabelas };