/// <reference types="cypress" />

context('🛒 Testes de CRUD de Doações no Front-End', () => {
  beforeEach(() => {
    // ✅ Mock da busca de alimento (antes do visit!)
    cy.intercept(
      'GET',
      '/food?name=Macarr%C3%A3o',
      {
        statusCode: 200,
        body: [{
          id: 2000,
          name: 'Macarrão',
          quantity: 100,
          expiration: '2025-12-10'
        }]
      }
    ).as('getMockedFood');

    // ✅ Login
    cy.request('POST', 'http://localhost:3001/auth/login', {
      username: 'admin',
      password: '123456',
    }).then((res) => {
      expect(res.status).to.eq(200);
      window.localStorage.setItem('token', res.body.token);
    });

    // ✅ Visita a página depois de interceptar
    cy.visit('http://localhost:3001/donation.html');
  });

  it('✅ Deve registrar uma nova doação com sucesso (com mock)', () => {
    // Busca por "Macarrão"
    cy.get('#searchFood').clear().type('Macarrão');
    cy.get('#btnSearchFood').click();
    cy.wait('@getMockedFood');

    // Confirma ID preenchido com valor do mock
    cy.get('#donationFoodId').should('have.value', '2000');

    // Preenche o restante do formulário
    cy.get('#donationQuantity').type('10');
    cy.get('#reference').type('REF-CYPRESS');
    cy.get('#donorName').type('Doador Cypress');
    cy.get('#donationDate').invoke('val', '2025-04-10').trigger('change');
    cy.get('#donationExpiration').invoke('val', '2025-12-10').trigger('change');

    // Submete o formulário
    cy.get('#donationForm').submit();

    // Valida o alerta de sucesso
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Doação registrada com sucesso');
    });
  });

  it('❌ Deve mostrar erro ao tentar registrar sem preencher campos obrigatórios', () => {
    cy.get('#donationForm').submit();
    cy.on('window:alert', (msg) => {
      expect(msg).to.match(/ID do alimento e quantidade são obrigatórios|Erro ao registrar doação/i);
    });
  });

  it('📋 Deve carregar histórico de doações (mock)', () => {
    cy.intercept('GET', '/donation', {
      statusCode: 200,
      body: [
        {
          id: 1,
          food_name: 'Feijão',
          quantity: 3,
          reference: 'REF123',
          donor_name: 'Carlos',
          donation_date: '01-04-2025',
          expiration: '31-12-2025'
        }
      ]
    }).as('mockGetHistory');

    cy.reload();
    cy.wait('@mockGetHistory');
    cy.get('#donationHistory tbody tr').should('have.length.at.least', 1);
    cy.get('#donationHistory').should('contain', 'Feijão');
  });

  it('❌ Deve mostrar mensagem de erro ao buscar alimento inexistente (mock)', () => {
    cy.intercept('GET', '/food?name=Invalido123', {
      statusCode: 200,
      body: []
    }).as('mockAlimentoNaoEncontrado');

    cy.get('#searchFood').clear().type('Invalido123');
    cy.get('#btnSearchFood').click();
    cy.wait('@mockAlimentoNaoEncontrado');
    cy.get('#searchResult').should('contain', 'Item não encontrado');
  });

  it('🚪 Deve realizar logout e redirecionar para login', () => {
    cy.get('#logoutButton').click();
    cy.url().should('include', '/login');
  });
});
