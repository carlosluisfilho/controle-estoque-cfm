const { authenticateUser } = require('../services/authService');
const request = require('supertest');
const { app, server } = require('../server'); // ✅ Agora importa corretamente

afterAll(() => {
  server.close((err) => {
      if (err) {
          console.error("❌ Erro ao encerrar o servidor:", err.message);
      } else {
          console.log("✅ Servidor de testes encerrado.");
      }
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