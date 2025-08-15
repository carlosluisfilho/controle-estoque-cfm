// cypress/e2e/login.cy.js
describe('🔐 Tela de Login', () => {

    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('✅ Exibe formulário de login corretamente', () => {
      cy.get('form#loginForm').should('exist');
      cy.get('input#username').should('exist');
      cy.get('input#password').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Entrar');
    });
  
    it('✅ Realiza login com sucesso e redireciona', () => {
      cy.intercept('POST', '/auth/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      });
  
      cy.get('#username').type('admin');
      cy.get('#password').type('123456');
      cy.get('#loginForm').submit();
  
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.window().its('localStorage.token').should('eq', 'fake-jwt-token');
    });
  
    it('❌ Exibe erro ao falhar no login', () => {
      cy.intercept('POST', '/auth/login', {
        statusCode: 401,
        body: { error: 'Credenciais inválidas' },
      });
  
      cy.get('#username').type('admin');
      cy.get('#password').type('errado');
      cy.get('#loginForm').submit();
  
      cy.get('#mensagemErro').should('be.visible').and('contain', 'Credenciais inválidas');
    });
  
    it('❌ Exibe erro em caso de falha de servidor', () => {
      cy.intercept('POST', '/auth/login', { forceNetworkError: true });
  
      cy.get('#username').type('admin');
      cy.get('#password').type('123456');
      cy.get('#loginForm').submit();
  
      cy.get('#mensagemErro').should('be.visible').and('contain', 'Erro inesperado');
    });
  });