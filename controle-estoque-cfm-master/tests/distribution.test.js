// tests/distribution.test.js
const request = require('supertest');
const express = require('express');
const distributionRouter = require('../routes/distribution');
const db = require('../database/db');

jest.mock('../middleware/auth', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/distribution', distributionRouter);

let distributionId;

beforeAll(done => {
  db.serialize(() => {
    db.run(`DELETE FROM distribution`);
    db.run(`DELETE FROM food`);
    db.run(`
      INSERT INTO food (id, name, quantity, date, reference, purchase_value, expiration)
      VALUES (3000, 'Arroz Teste', 100, '2025-01-01', 'REF-ARROZ-01', 5.0, '2025-12-31')
    `, done);
  });
});

describe('CRUD completo para /distribution', () => {
  it('POST /distribution - cria nova distribuição com sucesso', async () => {
    const res = await request(app)
      .post('/distribution')
      .send({
        food_id: 3000,
        quantity: 20,
        house_name: 'Casa Esperança'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.house_name).toBe('Casa Esperança');
    distributionId = res.body.id;

    db.get('SELECT quantity FROM food WHERE id = 3000', (_, row) => {
      expect(row.quantity).toBe(80); // 100 - 20
    });
  });

  it('POST /distribution - falha com dados inválidos', async () => {
    const res = await request(app).post('/distribution').send({ quantity: -10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('GET /distribution - lista todas as distribuições', async () => {
    const res = await request(app).get('/distribution');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PUT /distribution/:id - atualiza distribuição existente', async () => {
    const res = await request(app)
      .put(`/distribution/${distributionId}`)
      .send({
        food_id: 3000,
        quantity: 25,
        house_name: 'Casa Atualizada'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Distribuição atualizada com sucesso.');
  });

  it('DELETE /distribution/:id - remove a distribuição existente', async () => {
    const res = await request(app).delete(`/distribution/${distributionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Distribuição removida com sucesso.');
  });

  it('DELETE /distribution/:id - falha ao remover distribuição inexistente', async () => {
    const res = await request(app).delete('/distribution/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrada/i);
  });
});