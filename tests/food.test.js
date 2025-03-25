const request = require('supertest');
const { app, server } = require('../server'); // ✅ Agora importa corretamente

let token; // Armazena o token JWT gerado
let createdFoodId;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123456' });

  token = res.body.token; // Armazena o token para usar nos testes
});

afterAll((done) => {
  server.close(() => {
    done(); // ✅ chame done antes
    // ❌ console.log("✅ Servidor de testes encerrado.");
  });
});


describe('🍽️ Testes do CRUD de Alimentos', () => {

  test('✅ Criar um novo alimento', async () => {
    const res = await request(app)
      .post('/food')
      .set('Authorization', `Bearer ${token}`) // 🔥 Usando token válido
      .send({ name: 'Arroz', quantity: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdFoodId = res.body.id;
  });

  test('✅ Listar alimentos', async () => {
    const res = await request(app)
      .get('/food')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("✅ Atualizar um alimento", async () => {
    if (!token) {
      throw new Error("⛔ ERRO: O token JWT não foi gerado corretamente.");
    }
  
    const res = await request(app)
      .put(`/food/${createdFoodId}`)
      .set("Authorization", `Bearer ${token}`) // ✅ Agora usa um token válido
      .send({ name: "Arroz Integral", quantity: 150 });
  
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

});
