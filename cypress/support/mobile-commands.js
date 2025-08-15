// Comandos customizados para testes mobile

Cypress.Commands.add('checkMobileLayout', () => {
  // Verificar se não há overflow horizontal
  cy.get('body').should('not.have.css', 'overflow-x', 'scroll');
  
  // Verificar se elementos principais são visíveis
  cy.get('.container').should('be.visible');
  
  // Verificar se botões são acessíveis
  cy.get('.btn').each($btn => {
    cy.wrap($btn).should('be.visible');
  });
});

Cypress.Commands.add('testTableResponsiveness', (tableSelector) => {
  cy.get(tableSelector).should('be.visible');
  cy.get('.table-responsive').should('exist');
  cy.get('.table-responsive').should('have.css', 'overflow-x', 'auto');
});

Cypress.Commands.add('testFormResponsiveness', (formSelector) => {
  cy.get(formSelector).should('be.visible');
  
  // Verificar se inputs são acessíveis
  cy.get(`${formSelector} input`).each($input => {
    cy.wrap($input).should('be.visible');
  });
  
  // Verificar se botão de submit é visível
  cy.get(`${formSelector} button[type="submit"]`).should('be.visible');
});

Cypress.Commands.add('simulateMobileInteraction', (element) => {
  // Simular toque em dispositivo móvel
  cy.get(element)
    .should('be.visible')
    .trigger('touchstart')
    .trigger('touchend')
    .click();
});

Cypress.Commands.add('checkMobileNavigation', () => {
  // Verificar se navegação funciona em mobile
  cy.get('.header-bar').should('be.visible');
  cy.get('#logoutButton').should('be.visible');
  
  // Verificar se botões de ação são acessíveis
  cy.get('a[href="/food.html"]').should('be.visible');
  cy.get('a[href="/donation.html"]').should('be.visible');
  cy.get('a[href="/distribution.html"]').should('be.visible');
});