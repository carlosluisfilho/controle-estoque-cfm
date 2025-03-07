describe("🍽️ Testes de CRUD de Alimentos no Front-End", () => {
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
        cy.visit("/food.html");
      });
  
    it("✅ Adicionar um novo alimento", () => {
      cy.get("#foodName").type("Feijão");
      cy.get("#foodQuantity").type("20");
      cy.get("form").submit(); // Envia o formulário
  
      // 🛑 Valida o alerta de sucesso
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Alimento adicionado com sucesso!");
      });
  
      // 🔄 Aguarda a atualização da tabela e verifica se o item foi adicionado
      cy.get("#foodTable tbody").should("contain", "Feijão").and("contain", "20");
    });
  
    it("✅ Excluir um alimento", () => {
      cy.get('tbody tr', { timeout: 5000 }).should('have.length.greaterThan', 0); // Garante que há pelo menos 1 item na tabela
      cy.contains('td', 'Feijão').parent().find('button').click(); // Clica no botão correspondente
      cy.get('tbody').should('not.contain', 'Feijão'); // Verifica se o alimento foi removido
    });
  
    it("✅ Testar logout", () => {
      cy.get("button").contains("Logout").click(); // Clica no botão de logout
      cy.url().should("include", "/login"); // Verifica se redirecionou para a página de login
    });
  });
  