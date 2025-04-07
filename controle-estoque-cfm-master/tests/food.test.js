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
  server.close(() => {
    done();
  });
});

describe('🍽️ Testes do CRUD de Alimentos', () => {

  test('✅ Criar um novo alimento', async () => {
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
    createdFoodId = res.body.id;
  });

  test('✅ Listar alimentos', async () => {
    const res = await request(app)
      .get('/food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("✅ Atualizar um alimento", async () => {
    const res = await request(app)
      .put(`/food/${createdFoodId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Arroz Integral",
        quantity: 150,
        date: '2025-04-01',
        reference: 'TEST-001',
        purchase_value: 12.0,
        expiration: '2026-04-01'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Alimento atualizado com sucesso.");
  });

  test('✅ Excluir um alimento', async () => {
    const res = await request(app)
      .delete(`/food/${createdFoodId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alimento removido com sucesso.');
  });

  test('✅ Criar um novo alimento com total e mês de referência', async () => {
    const res = await request(app)
      .post('/food')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Arroz Teste',
        quantity: 100,
        date: '2025-04-01',
        reference: 'TEST-001',
        purchase_value: 10.5,
        expiration: '2026-04-01'
      });
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total');
    expect(res.body.total).toBeCloseTo(1050.0); // 100 * 10.5
    expect(res.body).toHaveProperty('month_reference', '2025-04');
    createdFoodId = res.body.id;
  }); 

});