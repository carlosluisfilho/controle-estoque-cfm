const request = require('supertest');
const { app, server } = require('../server');

afterAll((done) => {
  server.close(() => {
    done(); // Encerra o servidor de teste
  });
});

describe('🔐 Testes de Autenticação', () => {
  
  test('✅ Login bem-sucedido retorna token JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/); // Verifica padrão JWT
  });

  test('❌ Login com credenciais inválidas retorna erro', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'senhaErrada' });
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Usuário ou senha incorretos.');
  });

  test('❌ Login sem credenciais retorna erro de validação', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({}); // Nenhum campo enviado

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error'); // Ex: "Campos obrigatórios"
  });

  test('🔒 Acesso negado sem token JWT', async () => {
    const res = await request(app).get('/food'); // Rota protegida sem token
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Acesso negado');
  });

  test('❌ Token inválido retorna erro 403', async () => {
    const res = await request(app)
      .get('/food')
      .set('Authorization', 'Bearer token.invalido.aqui');

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Token inválido');
  });

  test('🔑 Acesso permitido com token JWT', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: '123456' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
