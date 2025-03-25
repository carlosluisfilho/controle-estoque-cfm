const { authenticateUser } = require('../services/authService');
const request = require('supertest');
const { app, server } = require('../server'); // ✅ Agora importa corretamente

afterAll((done) => {
    server.close(() => {
      done(); // ✅ chame done antes
      // ❌ console.log("✅ Servidor de testes encerrado.");
    });
  });
  
describe('authenticateUser', () => {
    test('should return success for valid credentials', () => {
        const result = authenticateUser('admin', '123456');
        expect(result).toEqual({ status: 'success', message: 'Autenticado com sucesso' });
    });

    test('should return error for invalid credentials', () => {
        const result = authenticateUser('user', 'wrongpassword');
        expect(result).toEqual({ status: 'error', message: 'Credenciais Invalidas' });
    });
});