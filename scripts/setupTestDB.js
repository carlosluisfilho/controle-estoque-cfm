const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Caminho do banco de dados de teste
const testDBPath = path.join(__dirname, '..', 'database', 'test.db');

if (process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ Este script deve ser executado apenas em ambiente de testes (NODE_ENV=test)');
  process.exit(1);
}

// Remove o banco de teste se ele existir
if (fs.existsSync(testDBPath)) {
  console.log('🗑️ Limpando banco de testes...');
  fs.unlinkSync(testDBPath);
}

// Após remover, importa novamente a instância do banco
// Isso força a recriação do banco e das tabelas via db.js
console.log('📦 Criando tabelas de teste...');
require('../database/db');

// Aguarde um curto tempo para garantir que o banco foi criado
setTimeout(() => {
  console.log('🌱 Inserindo dados iniciais...');

  const insertUser = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  const bcrypt = require('bcrypt');
  const senhaHash = bcrypt.hashSync('123456', 10);

  db.run(insertUser, ['admin', senhaHash, 'admin'], (err) => {
    if (err) {
      console.error('❌ Erro ao inserir usuário de teste:', err.message);
    } else {
      console.log('✅ Banco de testes configurado!');
      process.exit(0);
    }
  });
}, 500);
