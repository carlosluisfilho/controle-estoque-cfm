// scripts/runAllTests.js
const { execSync, spawn } = require('child_process');

(async () => {
  try {
    console.log('\n🔹 🛑 Encerrando servidor anterior');
    execSync('npm run test:stop', { stdio: 'inherit' });

    console.log('\n🔹 🔄 Configurando banco de testes');
    execSync('npm run test:setup', { stdio: 'inherit' });

    console.log('\n🔹 🧪 Executando testes de backend (Jest)');
    execSync('npm run test:backend', { stdio: 'inherit' });

    console.log('\n🔹 🚀 Iniciando servidor de testes');
    const servidor = spawn('node', ['server.js'], {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'inherit',
    });

    // ✅ Aguarda o servidor estar disponível
    //execSync('node scripts/healthcheck.js 3001', { stdio: 'inherit' });

    console.log('\n🔹 🌐 Executando testes de frontend (Cypress)');
    execSync('npx cypress run --config-file config/cypress.config.js', { stdio: 'inherit' });

    console.log('\n🔹 🛑 Encerrando servidor de testes');
    servidor.kill('SIGINT');

    console.log('\n✅ Fluxo de testes finalizado.');
  } catch (err) {
    console.error('\n❌ Erro durante a execução dos testes:', err.message);
    process.exit(1);
  }
})();
