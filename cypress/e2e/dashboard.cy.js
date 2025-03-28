describe("📊 Testes do Painel de Controle (Dashboard)", () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
  
    // Adiciona um alimento para que a tabela não fique vazia
    cy.visit('http://localhost:3001/food');
    cy.get('input[name="name"]').type('Feijão');
    cy.get('input[name="quantity"]').type('20');
    cy.get('button[type="submit"]').click();
  
    // Retorna para o painel
    cy.visit('http://localhost:3001/dashboard');
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
        // Garante que a URL é /painel
        cy.url({ timeout: 10000 }).should("include", "/painel"); 

      
        // Aguarda até o botão de logout realmente aparecer
        cy.contains("Logout").should("be.visible").click();
      
        // Verifica redirecionamento para /login
        cy.url({ timeout: 10000 }).should("include", "/login");
      
        // Confirma que o token foi removido
        cy.window().then((win) => {
          expect(win.localStorage.getItem("token")).to.be.null;
        });
      });
      
  });
  