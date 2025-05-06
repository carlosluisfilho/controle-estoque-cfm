// cypress/e2e/food.cy.js

describe("🥫 Testes de Gerenciamento de Itens", () => {
  beforeEach(() => {
    // Login via API
    cy.request("POST", "http://localhost:3001/auth/login", {
      username: "admin",
      password: "123456",
    }).then((res) => {
      expect(res.status).to.eq(200);
      localStorage.setItem("token", res.body.token);
    });

    cy.visit("http://localhost:3001/food.html");
  });

  it("✅ Deve carregar a tabela de alimentos", () => {
    cy.intercept("GET", "/food", {
      statusCode: 200,
      body: [
        {
          id: 99,
          name: "Arroz",
          quantity: 50,
          date: "2025-05-01",
          reference: "REF001",
          purchase_value: 100.0,
          expiration: "2026-05-01",
        },
      ],
    });

    cy.reload();
    cy.get("#foodTable tbody tr").should("have.length.at.least", 1);
    cy.get("#foodTable tbody tr").first().within(() => {
      cy.get("td").eq(1).should("contain", "Arroz");
    });
  });

  it("✅ Deve adicionar novo alimento com sucesso", () => {
    cy.intercept("POST", "/food", (req) => {
      expect(req.body).to.include({
        name: "Feijão Teste",
        quantity: "25",
        reference: "REFTEST",
      });

      req.reply({
        statusCode: 201,
        body: { id: 888, message: "Alimento adicionado com sucesso!" },
      });
    }).as("postFood");

    cy.get("#foodName").type("Feijão Teste");
    cy.get("#foodQuantity").type("25");
    cy.get("#foodDate").type("2025-06-01");
    cy.get("#foodReference").type("REFTEST");
    cy.get("#foodValue").type("120.99");
    cy.get("#foodExpiration").type("2026-06-01");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alerta");
    });

    cy.get("#addFoodForm button[type='submit']").click();

    cy.wait("@postFood");
    cy.get("@alerta").should("have.been.calledWith", "✅ Alimento adicionado com sucesso!");
  });

  it("❌ Deve falhar ao adicionar alimento com campos vazios", () => {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertaErro");
    });

    cy.get("#foodName").clear();
    cy.get("#addFoodForm button[type='submit']").click();

    cy.get("@alertaErro").should("have.been.calledWith", "Por favor, preencha todos os campos.");
  });

  it("❌ Deve exibir erro ao buscar alimentos sem token", () => {
    localStorage.removeItem("token");
    cy.visit("http://localhost:3001/food.html");
    cy.url().should("include", "/login");
  });

  it("🚪 Deve realizar logout corretamente", () => {
    cy.get("#logoutButton").click();
    cy.url({ timeout: 5000 }).should("include", "/login");
  });
});
