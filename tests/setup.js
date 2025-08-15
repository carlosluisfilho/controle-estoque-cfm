// Setup global para testes
const { stopTestServer } = require('../server');

// Cleanup após todos os testes
afterAll(async () => {
  await stopTestServer();
});