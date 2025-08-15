const request = require('supertest');
const { app } = require('../server');
const db = require('../database/db');
const bcrypt = require('bcrypt');

beforeAll((done) => {
  // Criar usuário de teste
  const hashedPassword = bcrypt.hashSync('123456', 10);
  db.run('INSERT OR REPLACE INTO users (id, username, password, role) VALUES (1, "admin", ?, "admin")', 
    [hashedPassword], done);
});

describe('🔐 Auth Routes', () => {
  test('✅ deve fazer login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: '123456' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('❌ deve retornar erro para credenciais inválidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'senhaErrada' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Usuário ou senha incorretos.');
  });
});