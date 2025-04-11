// tests/food.test.js
const request = require('supertest');
const { app, server } = require('../server');

let token;
let createdFoodId;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123456' });

  token = res.body.token;
});

afterAll((done) => {
  server.close(() => done());
});

describe('🍽️ Testes do CRUD de Alimentos', () => {

  test('✅ Cria alimento e retorna ID com sucesso', async () => {
    const res = await request(app)
      .post('/food')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Arroz',
        quantity: 100,
        date: '2025-04-01',
        reference: 'TEST-001',
        purchase_value: 10.5,
        expiration: '2026-04-01'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Arroz');
    createdFoodId = res.body.id;
  });

  test('✅ Lista todos os alimentos existentes', async () => {
    const res = await request(app)
      .get('/food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('✅ Atualiza alimento existente por ID', async () => {
    const res = await request(app)
      .put(`/food/${createdFoodId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Arroz Integral',
        quantity: 150,
        date: '2025-04-01',
        reference: 'TEST-001',
        purchase_value: 12.0,
        expiration: '2026-04-01'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alimento atualizado com sucesso.');
  });

  test('✅ Remove alimento existente por ID', async () => {
    const res = await request(app)
      .delete(`/food/${createdFoodId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alimento removido com sucesso.');
  });

  test('❌ Falha ao criar alimento com dados inválidos', async () => {
    const res = await request(app)
      .post('/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', quantity: -10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('❌ Falha ao atualizar alimento inexistente', async () => {
    const res = await request(app)
      .put(`/food/99999`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Fake',
        quantity: 1,
        date: '2025-01-01',
        reference: 'FAKE',
        purchase_value: 1.0,
        expiration: '2025-12-31'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrado/i);
  });

  test('❌ Falha ao remover alimento inexistente', async () => {
    const res = await request(app)
      .delete(`/food/99999`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrado/i);
  });
});