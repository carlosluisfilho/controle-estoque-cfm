const { execSync } = require('child_process');

const comandos = [
  { nome: '🛑 Encerrando servidor anterior', comando: 'npm run test:stop' },
  { nome: '🔄 Configurando banco de testes', comando: 'npm run test:setup' },
  { nome: '🧪 Executando testes de backend (Jest)', comando: 'npm run test:backend' },
  { nome: '🚀 Iniciando servidor de testes', comando: 'npm run test:server' },
  { nome: '🌐 Executando testes de frontend (Cypress)', comando: 'npm run test:frontend' },
  { nome: '🛑 Encerrando servidor de testes', comando: 'npm run test:stop' }
];

(async () => {
  for (const etapa of comandos) {
    console.log(`\n🔹 ${etapa.nome}`);
    try {
      execSync(etapa.comando, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`⚠️  Etapa falhou: ${etapa.nome}`);
      // Continua mesmo se der erro
    }
  }

  console.log('\n✅ Fluxo de testes finalizado.');
})();
