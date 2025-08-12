process.env.NODE_ENV = 'test';
const db = require('./database/db');

console.log('🔍 Verificando dados no banco...');

db.get("SELECT COUNT(*) as total FROM food", (err, row) => {
  if (err) console.error('Erro food:', err);
  else console.log('📦 Total alimentos:', row.total);
});

db.get("SELECT COUNT(*) as total FROM donation", (err, row) => {
  if (err) console.error('Erro donation:', err);
  else console.log('🎁 Total doações:', row.total);
});

db.get("SELECT COUNT(*) as total FROM distribution", (err, row) => {
  if (err) console.error('Erro distribution:', err);
  else console.log('📤 Total distribuições:', row.total);
});

setTimeout(() => {
  db.close();
}, 1000);