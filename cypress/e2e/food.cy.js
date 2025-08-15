describe('🍽️ Tela de Itens (Food)', () => {
  const nomeItem = `Item Cypress ${Date.now()}`;
  let token;

  before(() => {
    // Autentica via API e armazena o token para os testes
    cy.request('POST', '/auth/login', {
      username: 'admin',
      password: '123456',
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  beforeEach(() => {
    // Injeta o token no localStorage antes de visitar a página
    cy.visit('/food.html', {
      timeout: 30000,
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });
    cy.wait(1000); // Aguarda carregamento completo
  });

  it('Deve exibir a tabela de itens e o formulário de cadastro', () => {
    cy.get('#foodTable').should('be.visible');
    cy.get('#addFoodForm').should('be.visible');
  });

  it('Deve validar campos obrigatórios ao tentar cadastrar item vazio', () => {
    cy.get('#addFoodForm').submit();
    cy.get('.modal .btn-danger').click();
    cy.wait(1000);
    cy.get('#mensagem').should('be.visible');
  });

  it('Deve cadastrar um item com sucesso', () => {
    cy.get('#foodName').type(nomeItem);
    cy.get('#foodQuantity').type('80');
    cy.get('#foodDate').type('2025-04-01');
    cy.get('#foodReference').type('Unidade');
    cy.get('#foodValue').type('10.50');
    cy.get('#foodExpiration').type('2025-12-31');
    cy.get('#addFoodForm').submit();
    
    // Aguardar modal aparecer e clicar em confirmar
    cy.get('.modal', { timeout: 10000 }).should('be.visible');
    cy.get('.modal .btn-danger').eq(0).should('be.visible').click();
    cy.wait(2000);
    cy.get('#mensagem').should('be.visible');
    
    // Verificar se o item foi adicionado na tabela
    cy.contains('td', nomeItem).should('exist');
  });
});
