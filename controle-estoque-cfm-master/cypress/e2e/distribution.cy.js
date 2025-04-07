describe("🛒 Testes de Distribuições de Alimentos", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3001/auth/login", {
      username: "admin",
      password: "123456",
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem("token", response.body.token);
    });

    cy.visit("http://localhost:3001/distribution.html");
  });

  it("✅ Deve buscar um alimento com sucesso", () => {
    cy.intercept("GET", "/food?name=Arroz", {
      statusCode: 200,
      body: [{ id: 1, name: "Arroz", quantity: 50 }],
    });

    cy.get("#searchFood").clear().type("Arroz");
    cy.get("#btnSearchFood").click();

    cy.get("#searchResult", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "✅ Arroz encontrado! Quantidade disponível: 50");

    cy.get("#distributionFoodId").should("have.value", "1");
  });

  it("❌ Deve exibir erro quando o alimento não for encontrado", () => {
    cy.intercept("GET", "/food?name=Peixe", {
      statusCode: 200,
      body: [],
    });

    cy.get("#searchFood").clear().type("Peixe");
    cy.get("#btnSearchFood").click();

    cy.get("#searchResult", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "❌ Alimento não encontrado.");
  });

  it("🎁 Deve registrar uma distribuição com sucesso", () => {
    cy.intercept("GET", "/food?name=Macarr%C3%A3o", {
      statusCode: 200,
      body: [{ id: 3, name: "Macarrão", quantity: 80 }],
    }).as("getFood");

    cy.intercept("POST", "/distribution", (req) => {
      expect(req.body).to.deep.equal({
        food_id: 3,
        quantity: 10,
        house_name: "Casa de Apoio",
      });

      req.reply({
        statusCode: 201,
        body: { id: 456, message: "Distribuição registrada com sucesso!" },
      });
    }).as("postDistribution");

    cy.visit("http://localhost:3001/distribution.html");

    cy.get("#searchFood").clear().type("Macarrão");
    cy.get("#btnSearchFood").click();

    cy.wait("@getFood");
    cy.get("#distributionFoodId", { timeout: 8000 }).should("have.value", "3");

    cy.get("#distributionQuantity").type("10");
    cy.get("#houseName").type("Casa de Apoio");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alerta");
    });

    cy.get("button[type='submit']").click();

    cy.get("@alerta").should(
      "have.been.calledWith",
      "✅ Distribuição registrada com sucesso!"
    );

    cy.wait("@postDistribution");
  });

  it("❌ Deve falhar ao registrar distribuição sem preencher campos obrigatórios", () => {
    cy.intercept("POST", "/distribution").as("postDistribution");

    cy.get("#distributionQuantity").clear();
    cy.get("#houseName").clear();
    cy.get("button[type='submit']").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contain("Preencha todos os campos corretamente.");
    });

    cy.wait(500);
    cy.get("@postDistribution.all").should("have.length", 0);
  });

  it("📋 Deve exibir o histórico de distribuições corretamente", () => {
    cy.intercept("GET", "/distribution", {
      statusCode: 200,
      body: [
        {
          id: 123,
          food_name: "Arroz",
          quantity: 10,
          house_name: "Casa de Apoio",
          created_at: "2025-02-20 17:11:58",
        },
      ],
    });

    cy.reload();

    cy.get("#distributionHistory tbody")
      .find("tr")
      .should("have.length.greaterThan", 0);

    cy.get("#distributionHistory tbody tr")
      .first()
      .within(() => {
        cy.get("td").eq(1).should("contain", "Arroz");
        cy.get("td").eq(2).should("contain", "10");
        cy.get("td").eq(3).should("contain", "Casa de Apoio");
      });
  });

  it("🔄 Deve exibir quantidade atualizada após distribuição", () => {
    cy.intercept("GET", "/food?name=Macarr%C3%A3o", {
      statusCode: 200,
      body: [{ id: 3, name: "Macarrão", quantity: 70 }], // Esperado após -10
    }).as("refetchFood");

    // Simula nova busca após distribuição
    cy.get("#searchFood").clear().type("Macarrão");
    cy.get("#btnSearchFood").click();

    cy.wait("@refetchFood");

    cy.get("#searchResult", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "✅ Macarrão encontrado! Quantidade disponível: 70");
  });

  it("🚪 Deve realizar logout corretamente", () => {
    cy.get("#logoutButton").click();
    cy.url({ timeout: 5000 }).should("include", "/login");
  });
});