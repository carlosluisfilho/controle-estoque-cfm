// Database check utility - for development/testing only
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'test';
  const db = require('./database/db');
  
  console.log('🔍 Verificando dados no banco...');
  
  // Database queries follow...
} else {
  console.error('❌ Este script não deve ser executado em produção');
  process.exit(1);
}

  db.get("SELECT COUNT(*) as total FROM food", (err, row) => {
    if (err) console.error('Erro food:', encodeURIComponent(err.message));
    else console.log('📦 Total alimentos:', row.total);
  });
  
  db.get("SELECT COUNT(*) as total FROM donation", (err, row) => {
    if (err) console.error('Erro donation:', encodeURIComponent(err.message));
    else console.log('🎁 Total doações:', row.total);
  });
  
  db.get("SELECT COUNT(*) as total FROM distribution", (err, row) => {
    if (err) console.error('Erro distribution:', encodeURIComponent(err.message));
    else console.log('📤 Total distribuições:', row.total);
  });
  
  setTimeout(() => {
    db.close();
  }, 1000);