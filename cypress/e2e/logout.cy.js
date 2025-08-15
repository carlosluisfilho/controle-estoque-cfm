// cypress/e2e/logout.cy.js
describe('🔚 Logout do Sistema', () => {

    beforeEach(() => {
      window.localStorage.setItem('token', 'fake-jwt-token');
      cy.visit('/logout');
    });
  
    it('✅ Remove token e redireciona para /login', () => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
  
      cy.url({ timeout: 2000 }).should('include', '/login');
    });
  
    it('✅ Exibe spinner e mensagem de saída', () => {
      cy.get('.spinner-border').should('exist');
      cy.contains('Você está sendo desconectado').should('be.visible');
    });
  });
  