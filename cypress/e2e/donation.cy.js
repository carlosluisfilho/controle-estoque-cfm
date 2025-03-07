describe("🛒 Testes de CRUD de Doações no Front-End", () => {
  
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
    
        // ✅ Agora visita a página de Gerenciar Alimentos
        cy.visit("/donation.html");
      });
  
    it("✅ Deve carregar a página de doações corretamente", () => {
      cy.contains("Registrar Doações").should("be.visible");
      cy.contains("Histórico de Doações").should("be.visible");
      cy.contains("Gerar Relatórios").should("be.visible");
    });
  
    it("🔍 Deve buscar um alimento existente", () => {
      cy.intercept("GET", "/food?name=Arroz", {
        statusCode: 200,
        body: [{ id: 1, name: "Arroz", quantity: 50 }],
      });
  
      cy.get("#searchFood").type("Arroz");
      cy.get("#btnSearchFood").click();
  
      cy.contains("✅ Arroz encontrado! Quantidade disponível: 50").should("be.visible");
      cy.get("#donationFoodId").should("have.value", "1");
    });
  
    it("❌ Deve mostrar erro quando alimento não for encontrado", () => {
        cy.intercept("GET", "/food?name=Macarrão", { statusCode: 200, body: [] });
      
        cy.get("#searchFood").type("Peixe");
        cy.get("#btnSearchFood").click();
      
        // Aguarda a atualização do resultado
        cy.get("#searchResult", { timeout: 8000 })
          .should("be.visible")
          .and("contain", "❌ Alimento não encontrado.");
      });
      
  
      it("🎁 Deve registrar uma doação com sucesso", () => {
        // Intercepta a busca de alimento
         cy.intercept("GET", "/food?name=Arroz", {
           statusCode: 200,
           body: [{ id: 1, name: "Arroz", quantity: 50 }],
         });
      
        // Simula a busca do alimento
        cy.get("#searchFood").type("Arroz");
        cy.get("#btnSearchFood").click();
      
        // Aguarda o ID do alimento ser preenchido automaticamente
        cy.get("#donationFoodId", { timeout: 8000 }).should("have.value", "1");
      
        // Intercepta a requisição de doação
        cy.intercept("POST", "/donation", {
          statusCode: 201,
          body: { id: 123, message: "Doação registrada com sucesso!" },
        });
      
        cy.get("#donationQuantity").type("10");
        cy.get("#donorName").type("Carlos");
      
        cy.get("button[type='submit']").click();
      
        // Aguarda alerta de sucesso
        cy.on("window:alert", (text) => {
          expect(text).to.contains("✅ Doação registrada e estoque atualizado!");
        });
      
        // Confirma que o formulário foi resetado
        //cy.get("#donationForm").should("be.empty");
      });
  
    it("📋 Deve carregar histórico de doações", () => {
      cy.intercept("GET", "/donation", {
        statusCode: 200,
        body: [
          { id: 1, food_name: "Feijão", quantity: 10, donor_name: "Carlos", created_at: "2024-02-18T12:00:00Z" },
        ],
      });
  
      cy.reload();
      cy.contains("Feijão").should("be.visible");
      cy.contains("Carlos").should("be.visible");
    });
  
    it("📊 Deve gerar relatório de doações em PDF", () => {
      cy.intercept("GET", "/relatorios/donations/pdf", {
        statusCode: 200,
        body: new Blob(),
      });
  
      cy.get("a").contains("Gerar Relatório PDF").click();
    });
  
    it("📊 Deve gerar relatório de doações em Excel", () => {
      cy.intercept("GET", "/relatorios/donations/excel", {
        statusCode: 200,
        body: new Blob(),
      });
  
      cy.get("a").contains("Gerar Relatório Excel").click();
    });
  
    it("🚪 Deve realizar logout corretamente", () => {
      cy.get("#logoutButton").click();
      cy.url().should("include", "/login");
    });
  
  });
  