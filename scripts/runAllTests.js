// scripts/runAllTests.js
const { execSync, spawn } = require('child_process');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

(async () => {
  let servidor;

  try {
    console.log('\n🔹 🛑 Encerrando servidor anterior');
    execSync('npm run test:stop', { stdio: 'inherit' });

    console.log('\n🔹 🔄 Configurando banco de testes');
    execSync('npm run test:setup', { stdio: 'inherit' });

    console.log('\n🔹 🧪 Executando testes de backend (Jest)');
    execSync('npm run test:backend', { stdio: 'inherit' });

    console.log('\n🔹 🚀 Iniciando servidor para testes de frontend');
    
    // Usar o script dedicado para iniciar o servidor
    servidor = spawn('node', ['scripts/startTestServer.js'], {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'pipe',
    });

    // Capturar saída do servidor
    servidor.stdout.on('data', (data) => {
      console.log(data.toString().trim());
    });
    
    servidor.stderr.on('data', (data) => {
      console.error(data.toString().trim());
    });

    // Aguardar um pouco antes do healthcheck
    console.log('\n🔹 ⏳ Aguardando servidor inicializar...');
    await sleep(5000);
    
    // Aguarda o servidor estar online (timeout: 30s)
    console.log('\n🔹 ⏳ Aguardando servidor ficar disponível...');
    execSync('node scripts/healthcheck.js 3001 --timeout=30000', { stdio: 'inherit' });

    console.log('\n🔹 🌐 Executando testes de frontend (Cypress)');
    execSync('npx cypress run --config-file config/cypress.config.js', { stdio: 'inherit' });

    console.log('\n🔹 🛑 Encerrando servidor de testes');
    if (servidor) servidor.kill('SIGINT');

    console.log('\n✅ Fluxo de testes finalizado com sucesso.');

  } catch (err) {
    console.error('\n❌ Erro durante a execução dos testes:', err.message);

    if (servidor) {
      console.log('\n🛑 Encerrando servidor de testes após falha...');
      servidor.kill('SIGINT');
    }

    process.exit(1);
  }

  // Captura encerramento por sinal externo (Ctrl+C, CI)
  process.on('SIGINT', () => {
    console.log('\n🛑 Interrupção recebida (SIGINT). Encerrando servidor...');
    if (servidor) servidor.kill('SIGINT');
    process.exit();
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Encerramento solicitado (SIGTERM). Encerrando servidor...');
    if (servidor) servidor.kill('SIGINT');
    process.exit();
  });
})();
