const request = require("supertest");
const express = require("express");
const dashboardRouter = require("../routes/dashboard");
const db = require("../database/db");

jest.mock("../middleware/auth", () => (req, res, next) => next());

const app = express();
app.use("/dashboard", dashboardRouter);

beforeAll(done => {
  db.serialize(() => {
    db.run("DELETE FROM donation");
    db.run("DELETE FROM distribution");
    db.run("DELETE FROM food");
    db.run(`
      INSERT INTO food (id, name, quantity, date, reference, purchase_value, expiration, created_at)
      VALUES (4000, 'Feijão Teste', 200, '2025-01-01', 'REF-FEIJ-01', 6.0, '2025-12-31', '2025-04-01')
    `);
    db.run(`
      INSERT INTO donation (food_id, quantity, donor_name, reference, expiration, donation_date, created_at)
      VALUES (4000, 20, 'Doador 1', 'REF-FEIJ-01', '2025-12-15', '2025-04-01', '2025-04-01')
    `);
    db.run(`
      INSERT INTO distribution (food_id, quantity, house_name, created_at)
      VALUES (4000, 10, 'Casa Teste', '2025-04-02')
    `, done);
  });
});

describe("GET /dashboard", () => {
  it("retorna totais e últimas movimentações", async () => {
    const res = await request(app).get("/dashboard");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totais");
    expect(res.body.totais).toMatchObject({
      alimentos: expect.any(Number),
      doacoes: expect.any(Number),
      distribuicoes: expect.any(Number),
    });

    expect(res.body).toHaveProperty("ultimasMovimentacoes");
    expect(res.body.ultimasMovimentacoes.alimentos.length).toBeGreaterThanOrEqual(1);
    expect(res.body.ultimasMovimentacoes.doacoes.length).toBeGreaterThanOrEqual(1);
    expect(res.body.ultimasMovimentacoes.distribuicoes.length).toBeGreaterThanOrEqual(1);
  });
});
