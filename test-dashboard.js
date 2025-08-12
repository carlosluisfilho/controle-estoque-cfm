const { startTestServer } = require('./server');

async function testDashboard() {
  try {
    console.log('🚀 Iniciando servidor...');
    await startTestServer(3002);
    
    console.log('✅ Servidor iniciado com sucesso!');
    
    // Testar endpoint do dashboard
    const response = await fetch('http://localhost:3002/dashboard', {
      headers: { 'Authorization': 'Bearer fake-token' }
    });
    
    console.log('📊 Status da resposta:', response.status);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testDashboard();