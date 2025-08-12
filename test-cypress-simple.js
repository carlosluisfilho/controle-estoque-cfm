const { startTestServer, stopTestServer } = require('./server');

async function testCypress() {
  let server;
  
  try {
    console.log('🚀 Iniciando servidor...');
    server = await startTestServer();
    
    console.log('⏳ Aguardando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🧪 Executando teste Cypress...');
    const { exec } = require('child_process');
    
    exec('npx cypress run --spec cypress/e2e/auth.cy.js --config-file config/cypress.config.js', 
      (error, stdout, stderr) => {
        console.log('📊 Resultado:', stdout);
        if (stderr) console.error('❌ Erro:', stderr);
        
        console.log('🛑 Encerrando servidor...');
        if (server) {
          server.close(() => {
            console.log('✅ Teste finalizado');
            process.exit(error ? 1 : 0);
          });
        }
      }
    );
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
}

testCypress();