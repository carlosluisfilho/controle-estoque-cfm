describe("🛒 Testes de Distribuições de Alimentos", () => {
    let token;
  
    beforeEach(() => {
      // 🔍 Acessa a página de login
      cy.visit("/login");
    
      // 🔑 Preenche e envia o formulário de login
      cy.get("#username").type("admin");
      cy.get("#password").type("123456");
      cy.get("button[type='submit']").click();
  
      // 🛑 Aguarda a resposta do login e salva o token
      cy.request("POST", "/auth/login", {
        username: "admin",
        password: "123456",
      }).then((response) => {
        expect(response.status).to.eq(200);
        localStorage.setItem("token", response.body.token);
      });

      cy.visit("/distribution.html"); // Visita a página de distribuições
    });
  
    it("✅ Deve buscar um alimento com sucesso", () => {
      cy.intercept("GET", "/food?name=Arroz", {
        statusCode: 200,
        body: [{ id: 1, name: "Arroz", quantity: 50 }],
      });
  
      cy.get("#searchFood").type("Arroz");
      cy.get("#btnSearchFood").click();
  
      cy.get("#searchResult", { timeout: 8000 })
        .should("be.visible")
        .and("contain", "✅ Arroz encontrado! Quantidade disponível: 50");
  
      // Confirma que o ID do alimento foi preenchido
      cy.get("#distributionFoodId").should("have.value", "1");
    });
  
    it("❌ Deve exibir erro quando o alimento não for encontrado", () => {
      cy.intercept("GET", "/food?name=Macarrão", {
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
      // Intercepta a requisição de busca do alimento
      // cy.intercept("GET", "/food?name=Feijão", {
      //   statusCode: 200,
      //   body: [{ id: 2, name: "Feijão", quantity: 100 }],
      // });
  
      cy.get("#searchFood").clear().type("Macarrão");
      cy.get("#btnSearchFood").click();
  
      cy.get("#distributionFoodId", { timeout: 8000 }).should("have.value", "3");
  
      // Intercepta a requisição de registro de distribuição
      cy.intercept("POST", "/distribution", {
        statusCode: 201,
        body: { id: 456, message: "Distribuição registrada com sucesso!" },
      });
  
      cy.get("#distributionQuantity").type("10");
      cy.get("#houseName").type("Casa de Apoio");
  
      cy.get("button[type='submit']").click();
  
      // Verifica o alerta de sucesso
      cy.on("window:alert", (text) => {
        expect(text).to.contains("✅ Distribuição registrada com sucesso!");
      });
  
      // Confirma que o formulário foi resetado
      //cy.get("#distributionForm").should("be.empty");
    });
  
    it("❌ Deve falhar ao registrar distribuição sem preencher campos obrigatórios", () => {
      cy.get("#distributionQuantity").clear();
      cy.get("#houseName").clear();
  
      cy.get("button[type='submit']").click();
  
      // Verifica se o alerta de erro foi exibido
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Preencha todos os campos corretamente.");
      });
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
  
      cy.reload(); // Recarrega a página para garantir que o histórico seja buscado
  
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
  });
  