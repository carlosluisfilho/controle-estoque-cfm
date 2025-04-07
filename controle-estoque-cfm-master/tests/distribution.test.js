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
      VALUES (3000, 'Farinha Teste', 100, '2025-01-01', 'REFX123', 4.5, '2025-12-01')
    `, done);
  });
});

describe('CRUD completo para /distribution', () => {
  it('POST /distribution - cria nova distribuição com sucesso', async () => {
    const res = await request(app)
      .post('/distribution')
      .send({
        food_id: 3000,
        quantity: 10,
        house_name: 'Casa Teste'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    distributionId = res.body.id;
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
        quantity: 20,
        house_name: 'Casa Atualizada',
        created_at: '2025-04-04'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Distribuição atualizada com sucesso.");
  });

  it('DELETE /distribution/:id - remove distribuição existente', async () => {
    const res = await request(app).delete(`/distribution/${distributionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Distribuição removida com sucesso.");
  });

  it('🔄 Verifica se a quantidade do alimento foi subtraída corretamente', done => {
    db.get("SELECT quantity FROM food WHERE id = 3000", (err, row) => {
      expect(err).toBeNull();
      expect(row.quantity).toBe(90); // 100 - 10 da distribuição anterior
      done();
    });
  });
});
