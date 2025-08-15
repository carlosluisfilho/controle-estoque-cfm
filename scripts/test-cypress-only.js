const { execSync, spawn } = require('child_process');

async function testCypress() {
  let servidor;
  
  try {
    console.log('🚀 Iniciando servidor de teste...');
    servidor = spawn('node', ['scripts/startTestServer.js'], {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'inherit'
    });
    
    // Aguardar servidor inicializar
    console.log('⏳ Aguardando 5 segundos...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🧪 Executando teste simples do Cypress...');
    execSync('npx cypress run --spec cypress/e2e/auth.cy.js --config-file config/cypress.config.js', { 
      stdio: 'inherit' 
    });
    
    console.log('✅ Teste Cypress concluído!');
    
  } catch (error) {
    console.error('❌ Erro no Cypress:', error.message);
  } finally {
    if (servidor) {
      console.log('🛑 Encerrando servidor...');
      servidor.kill('SIGINT');
    }
  }
}

testCypress();