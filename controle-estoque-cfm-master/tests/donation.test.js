const request = require('supertest');
const express = require('express');
const donationRouter = require('../routes/donation');
const db = require('../database/db');

jest.mock('../middleware/auth', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/donation', donationRouter);

let donationId;

beforeAll(done => {
  db.serialize(() => {
    db.run(`DELETE FROM donation`);
    db.run(`DELETE FROM food`);
    db.run(`
      INSERT INTO food (id, name, quantity, date, reference, purchase_value, expiration)
      VALUES (2000, 'Macarrão Teste', 100, '2025-01-01', 'REF-TESTE-01', 7.5, '2025-11-30')
    `, done);
  });
});

describe('CRUD completo para /donation', () => {
  it('POST /donation - cria nova doação com sucesso', async () => {
    const res = await request(app)
      .post('/donation')
      .send({
        food_id: 2000,
        quantity: 10,
        donor_name: 'Carlos Teste',
        reference: 'REF-TESTE-01',
        expiration: '2025-11-30',
        donation_date: '2025-04-03'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.reference).toBe('REF-TESTE-01'); // Corrigido aqui
    donationId = res.body.id;
  });

  it('GET /donation - lista todas as doações', async () => {
    const res = await request(app).get('/donation');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('reference');
  });

  it('PUT /donation/:id - atualiza doação existente', async () => {
    const res = await request(app)
      .put(`/donation/${donationId}`)
      .send({
        food_id: 2000,
        quantity: 15,
        donor_name: 'Carlos Atualizado',
        reference: 'REF-TESTE-01', // Adicionado
        expiration: '2025-12-01',
        donation_date: '2025-04-04'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Doação atualizada com sucesso.");
  });

  it('DELETE /donation/:id - remove a doação existente', async () => {
    const res = await request(app).delete(`/donation/${donationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Doação removida com sucesso.");
  });

  it('DELETE /donation/:id - falha ao remover doação inexistente', async () => {
    const res = await request(app).delete(`/donation/99999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrada/i);
  });
});
