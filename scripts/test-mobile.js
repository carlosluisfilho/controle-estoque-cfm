const { exec } = require('child_process');

console.log('📱 Executando testes de responsividade mobile...');

const mobileTests = [
  'cypress/e2e/mobile.cy.js',
  'cypress/e2e/visual-mobile.cy.js', 
  'cypress/e2e/mobile-performance.cy.js'
];

async function runMobileTests() {
  for (const test of mobileTests) {
    console.log(`\n🧪 Executando: ${test}`);
    
    try {
      await new Promise((resolve, reject) => {
        exec(`npx cypress run --spec ${test} --config-file config/cypress.config.js`, 
          (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Erro em ${test}:`, error.message);
              reject(error);
            } else {
              console.log(`✅ ${test} passou!`);
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error(`❌ Falha em ${test}`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 Todos os testes mobile passaram!');
}

runMobileTests();