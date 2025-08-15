
describe('🔐 Testes de Autenticação', () => {
  it('Deve fazer login com credenciais corretas', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
    cy.contains('Painel de Controle');
  });

  it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('senhaIncorreta');
    cy.get('button[type="submit"]').click();
    cy.get('#mensagemErro').should('exist').and('not.have.class', 'd-none');
  });
});
