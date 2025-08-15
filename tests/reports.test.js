const request = require('supertest');
const { app } = require('../server');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123456' });
  token = res.body.token;
});

describe('🧾 Testes de Relatórios', () => {
  
  test('✅ Gera relatório PDF de doações', async () => {
    const res = await request(app)
      .get('/relatorios/donations/pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });

  test('✅ Gera relatório Excel de doações', async () => {
    const res = await request(app)
      .get('/relatorios/donations/excel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/vnd.openxmlformats/);
  });

  test('✅ Gera relatório PDF de distribuições', async () => {
    const res = await request(app)
      .get('/relatorios/distributions/pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });

  test('✅ Gera relatório Excel de distribuições', async () => {
    const res = await request(app)
      .get('/relatorios/distributions/excel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/vnd.openxmlformats/);
  });

  test('✅ Gera relatório PDF de alimentos', async () => {
    const res = await request(app)
      .get('/relatorios/food/pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });

  test('✅ Gera relatório Excel de alimentos', async () => {
    const res = await request(app)
      .get('/relatorios/food/excel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/vnd.openxmlformats/);
  });

  test('❌ Falha ao gerar relatório sem token', async () => {
    const res = await request(app).get('/relatorios/donations/pdf');
    expect(res.statusCode).toBe(401);
  });
});