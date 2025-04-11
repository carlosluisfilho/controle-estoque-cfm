// cypress/e2e/dashboard_ui.cy.js
describe('📊 Verificação visual e estrutural do Dashboard', () => {

  beforeEach(() => {
    window.localStorage.setItem('token', 'fake-token');
    cy.intercept('GET', '/dashboard', {
      statusCode: 200,
      body: {
        totais: {
          alimentos: 20,
          doacoes: 10,
          distribuicoes: 5
        },
        ultimasMovimentacoes: {
          alimentos: [
            { name: 'Arroz', quantity: 100, created_at: '2025-04-01T12:00:00' }
          ],
          doacoes: [
            { food_name: 'Feijão', quantity: 20, donor_name: 'Carlos', created_at: '2025-04-02T10:00:00' }
          ],
          distribuicoes: [
            { food_name: 'Macarrão', quantity: 15, house_name: 'Casa Esperança', created_at: '2025-04-03T09:00:00' }
          ]
        }
      }
    });
    cy.visit('/painel');
  });

  it('✅ Renderiza os totais corretamente', () => {
    cy.get('#totalAlimentos').should('contain', '20');
    cy.get('#totalDoacoes').should('contain', '10');
    cy.get('#totalDistribuicoes').should('contain', '5');
  });

  it('✅ Exibe as últimas movimentações com colunas visíveis', () => {
    cy.get('#tabelaAlimentos thead tr').within(() => {
      cy.contains('Nome');
      cy.contains('Qtd');
      cy.contains('Data');
    });

    cy.get('#tabelaDoacoes thead tr').within(() => {
      cy.contains('Alimento');
      cy.contains('Qtd');
      cy.contains('Doador');
      cy.contains('Data');
    });

    cy.get('#tabelaDistribuicoes thead tr').within(() => {
      cy.contains('Alimento');
      cy.contains('Qtd');
      cy.contains('Casa');
      cy.contains('Data');
    });
  });

  it('✅ Exibe botão de logout e executa logout corretamente', () => {
    cy.get('.btn').contains('Logout').click();
    cy.url().should('include', '/login');
    cy.wait(100);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
