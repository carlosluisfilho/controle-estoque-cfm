const { authenticateUser } = require('../services/authService');
const request = require('supertest');
const { app, server } = require('../server'); // ✅ Agora importa corretamente

afterAll((done) => {
    server.close(() => {
<<<<<<< HEAD
      done(); // ✅ chame done antes
      // ❌ console.log("✅ Servidor de testes encerrado.");
    });
  });
  
=======
      done();
    });
  });
  

>>>>>>> b75133b33d29fdfd89be45f0e8bca6aabb7ec0d0
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