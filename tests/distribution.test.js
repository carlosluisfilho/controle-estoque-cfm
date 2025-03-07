const request = require("supertest");
const { app, server } = require("../server");

let token;
let createdFoodId;
let distributionId;

beforeAll(async () => {
  console.log("🔑 Obtendo token de autenticação...");
  
  // 🔐 Obter token de autenticação antes dos testes
  const res = await request(app)
    .post("/auth/login")
    .send({ username: "admin", password: "123456" });

  // 🔥 Valida se o login foi bem-sucedido
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("token");

  token = res.body.token;
});

afterAll(async () => {
  console.log("🛑 Encerrando servidor de testes...");
  
  // Garantir que o servidor seja fechado corretamente
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error("❌ Erro ao encerrar o servidor:", err.message);
        reject(err);
      } else {
        console.log("✅ Servidor de testes encerrado.");
        resolve();
      }
    });
  });
});

describe("🛒 API de Distribuição de Doações", () => {
  test("✅ Deve registrar uma distribuição para casa de missão", async () => {
    console.log("🍚 Criando alimento para teste...");

    // 🔥 Primeiro, cria um alimento para garantir que food_id exista
    const foodResponse = await request(app)
      .post("/food")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Arroz", quantity: 50 });

    expect(foodResponse.statusCode).toBe(201); // Confirma que o alimento foi criado
    expect(foodResponse.body).toHaveProperty("id");

    createdFoodId = foodResponse.body.id;
    console.log("🍚 ID do alimento criado:", createdFoodId);

    console.log("🎁 Criando doação para teste...");

    // 🔥 Agora, cria a doação usando o food_id válido
    const donationResponse = await request(app)
      .post("/donation")
      .set("Authorization", `Bearer ${token}`)
      .send({ food_id: createdFoodId, quantity: 10, donor_name: "Carlos" });

    expect(donationResponse.statusCode).toBe(201);
    expect(donationResponse.body).toHaveProperty("id");

    console.log("🎁 ID da doação criada:", donationResponse.body.id);

    console.log("📦 Registrando distribuição...");

    // 🔥 Agora, realiza a distribuição
    const resDist = await request(app)
      .post("/distribution")
      .set("Authorization", `Bearer ${token}`)
      .send({
        food_id: createdFoodId, // ✅ Correção do food_id
        quantity: 10,
        house_name: "Casa de Apoio",
      });

    console.log("🔍 Resposta:", resDist.body);

    expect(resDist.statusCode).toBe(201);
    expect(resDist.body).toHaveProperty("message", "Distribuição registrada com sucesso!");

    distributionId = resDist.body.id; // Armazena ID da distribuição para futuros testes
  });

  test("❌ Deve falhar ao distribuir mais do que disponível no estoque", async () => {
    console.log("🚨 Testando distribuição inválida...");

    const res = await request(app)
      .post("/distribution")
      .set("Authorization", `Bearer ${token}`)
      .send({
        food_id: createdFoodId, // ✅ Correção do food_id
        quantity: 500, // Excede o estoque de 50 unidades
        house_name: "Casa de Apoio",
      });

    console.log("🔍 Resposta:", res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Quantidade insuficiente no estoque.");
  });

  test("📋 Deve listar todas as distribuições registradas", async () => {
    console.log("📋 Testando listagem de distribuições...");

    const res = await request(app)
      .get("/distribution")
      .set("Authorization", `Bearer ${token}`);

    console.log("🔍 Resposta:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
