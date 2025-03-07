const request = require('supertest');
const { app, server } = require('../server'); // ✅ Agora importa corretamente

afterAll(() => {
  server.close(); // Fecha o servidor após os testes
});

describe('🔐 Testes de Autenticação', () => {
  
  test('✅ Login bem-sucedido retorna token JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token'); // Deve retornar um token
  });

  test('❌ Login com credenciais inválidas retorna erro', async () => {
    jest.setTimeout(10000); // Define timeout maior para evitar falhas
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'senhaErrada' });
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Usuário ou senha incorretos.');
  });

  test('🔒 Acesso negado sem token JWT', async () => {
    const res = await request(app).get('/food'); // Tenta acessar rota protegida
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Acesso negado');
  });

  test('🔑 Acesso permitido com token JWT', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: '123456' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // Deve permitir acesso
  });
});