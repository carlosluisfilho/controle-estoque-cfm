describe("📊 Testes do Painel de Controle (Dashboard)", () => {
    beforeEach(() => {
      // 🔐 Login via API para obter token
      cy.request("POST", "http://localhost:3001/auth/login", {
        username: "admin",
        password: "123456",
      }).then((response) => {
        expect(response.status).to.eq(200);
        window.localStorage.setItem("token", response.body.token);
      });
  
      // Acessa a tela do painel
      cy.visit("http://localhost:3001/painel");
    });
  
    it("✅ Deve exibir os totais corretamente", () => {
      cy.get("#totalAlimentos").should("be.visible").and("not.be.empty");
      cy.get("#totalDoacoes").should("be.visible").and("not.be.empty");
      cy.get("#totalDistribuicoes").should("be.visible").and("not.be.empty");
    });
  
    it("📋 Deve exibir a tabela de Últimos Alimentos", () => {
      cy.get("#tabelaAlimentos tbody")
        .find("tr")
        .should("have.length.greaterThan", 0);
  
      cy.get("#tabelaAlimentos tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(0).should("not.be.empty"); // Nome
          cy.get("td").eq(1).should("not.be.empty"); // Quantidade
          cy.get("td").eq(2).should("not.be.empty"); // Data
        });
    });
  
    it("🎁 Deve exibir a tabela de Últimas Doações", () => {
      cy.get("#tabelaDoacoes tbody")
        .find("tr")
        .should("have.length.greaterThan", 0);
  
      cy.get("#tabelaDoacoes tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(0).should("not.be.empty"); // ID
          cy.get("td").eq(1).should("not.be.empty"); // Qtd
          cy.get("td").eq(2).should("not.be.empty"); // Doador
          cy.get("td").eq(3).should("not.be.empty"); // Data
        });
    });
  
    it("🛒 Deve exibir a tabela de Últimas Distribuições", () => {
      cy.get("#tabelaDistribuicoes tbody")
        .find("tr")
        .should("have.length.greaterThan", 0);
  
      cy.get("#tabelaDistribuicoes tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(0).should("not.be.empty"); // ID
          cy.get("td").eq(1).should("not.be.empty"); // Qtd
          cy.get("td").eq(2).should("not.be.empty"); // Casa
          cy.get("td").eq(3).should("not.be.empty"); // Data
        });
    });
  
    it("🚪 Deve permitir logout a partir do painel", () => {
      cy.get("#logoutButton").should("be.visible").click();
      cy.url({ timeout: 5000 }).should("include", "/login");
  
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
      });
    });
  });
  