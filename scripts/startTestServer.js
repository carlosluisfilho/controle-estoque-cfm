process.env.NODE_ENV = 'test';
const { startTestServer } = require('../server');

async function start() {
  try {
    await startTestServer();
    console.log('Servidor pronto para testes');
    
    // Manter o processo vivo
    process.stdin.resume();
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

start();