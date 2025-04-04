const { authenticateUser } = require('../services/authService');
const { app, server } = require('../server');
const db = require('../database/db');

afterAll((done) => {
  // Fecha o banco de dados e o servidor após os testes
  db.close(() => {
    server.close(() => {
      done();
    });
  });
});

describe('🔐 authService - authenticateUser()', () => {
  test('✅ deve retornar sucesso para credenciais válidas', async () => {
    const result = await authenticateUser('admin', '123456');
    expect(result).toEqual({
      status: 'success',
      message: 'Autenticado com sucesso',
    });
  });

  test('❌ deve retornar erro para credenciais inválidas', async () => {
    const result = await authenticateUser('usuarioInvalido', 'senhaErrada');
    expect(result).toEqual({
      status: 'error',
      message: 'Credenciais Invalidas',
    });
  });
});
