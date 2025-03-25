const request = require("supertest");
const { app, server } = require("../server");

let token;
let createdDonationId;
let createdFoodId;

beforeAll(async () => {
  // 🔐 Obter token de autenticação antes dos testes
  const res = await request(app)
    .post("/auth/login")
    .send({ username: "admin", password: "123456" });

  token = res.body.token;
});

afterAll((done) => {
  server.close(() => {
<<<<<<< HEAD
    done(); // ✅ chame done antes
    // ❌ console.log("✅ Servidor de testes encerrado.");
=======
    done();
>>>>>>> b75133b33d29fdfd89be45f0e8bca6aabb7ec0d0
  });
});


describe("🎁 Testes de CRUD de Doações", () => {
  test("✅ Criar uma nova doação", async () => {
    // 🔥 Primeiro, cria um alimento para garantir que food_id exista
    const foodResponse = await request(app)
      .post("/food")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Arroz", quantity: 50 });
  
    expect(foodResponse.statusCode).toBe(201); // Confirma que o alimento foi criado
    createdFoodId = foodResponse.body.id;
    console.log("🍚 ID do alimento criado:", createdFoodId); // Debug
  
    // 🔥 Agora, cria a doação usando o food_id válido
    const res = await request(app)
      .post("/donation")
      .set("Authorization", `Bearer ${token}`)
      .send({ food_id: createdFoodId, quantity: 10, donor_name: "Carlos" });
  
    console.log("🎁 ID da doação criada:", res.body.id); // Debug
  
    expect(res.statusCode).toBe(201); // ✅ Agora deve passar
    expect(res.body).toHaveProperty("id");
    createdDonationId = res.body.id;
  });

  test("✅ Listar doações", async () => {
    const res = await request(app)
      .get("/donation")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("✅ Excluir uma doação", async () => {
    console.log("🗑️ Tentando excluir doação ID:", createdDonationId); // Debug
  
    const res = await request(app)
      .delete(`/donation/${createdDonationId}`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200); // ✅ Deve passar
    expect(res.body.message).toBe("Doação removida com sucesso.");
  });
});
