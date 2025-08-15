process.env.NODE_ENV = 'test';
const { startTestServer } = require('./server');

async function testEndpoint() {
  try {
    console.log('🚀 Iniciando servidor...');
    await startTestServer(3003);
    
    console.log('🔍 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3003/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: process.env.TEST_USERNAME || 'admin', 
        password: process.env.TEST_PASSWORD || '123456' 
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('🔑 Token obtido');
    
    console.log('🔍 Testando endpoint /dashboard...');
    const response = await fetch('http://localhost:3003/dashboard', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📋 Dados:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

testEndpoint();