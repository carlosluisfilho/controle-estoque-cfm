const alertService = require('../services/alertService');

// Script para testar o sistema de alertas
async function testAlerts() {
  console.log('🧪 Testando sistema de alertas...\n');

  // Teste 1: Erro crítico
  console.log('1. Testando alerta de erro crítico...');
  const criticalError = new Error('Falha crítica no banco de dados');
  criticalError.name = 'DatabaseConnectionError';
  criticalError.statusCode = 500;
  
  await alertService.sendCriticalAlert(criticalError, {
    url: '/api/test',
    method: 'POST',
    ip: '127.0.0.1'
  });

  // Teste 2: Taxa de erro elevada
  console.log('2. Simulando taxa de erro elevada...');
  for (let i = 0; i < 12; i++) {
    const error = new Error(`Erro simulado ${i + 1}`);
    alertService.trackError(error, { url: '/api/test', method: 'GET' });
  }

  console.log('\n✅ Testes concluídos! Verifique seu email para os alertas.');
}

testAlerts().catch(console.error);