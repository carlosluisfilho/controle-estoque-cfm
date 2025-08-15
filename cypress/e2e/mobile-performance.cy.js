describe('⚡ Performance Mobile', () => {
  let token;

  before(() => {
    cy.request('POST', '/auth/login', {
      username: 'admin',
      password: '123456',
    }).then((response) => {
      token = response.body.token;
    });
  });

  beforeEach(() => {
    cy.viewport(375, 667); // iPhone SE
  });

  it('Dashboard deve carregar rapidamente em mobile', () => {
    const startTime = Date.now();
    
    cy.visit('/painel', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    cy.get('#totalAlimentos', { timeout: 10000 }).should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(5000); // Menos de 5 segundos para mobile
    });
  });

  it('Formulários devem responder rapidamente', () => {
    cy.visit('/food.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    const startTime = Date.now();
    
    cy.get('#foodName', { timeout: 10000 }).type('Teste Performance');
    cy.get('#foodQuantity').type('10');
    
    cy.then(() => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(3000); // Menos de 3 segundos para mobile
    });
  });

  it('Tabelas devem renderizar sem travamentos', () => {
    cy.visit('/food.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    // Verificar se tabela carrega sem delay excessivo
    cy.get('#foodTable tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Testar scroll da tabela
    cy.get('.table-responsive').scrollTo('right', { ensureScrollable: false });
    cy.get('.table-responsive').scrollTo('left', { ensureScrollable: false });
  });

  it('Modais devem abrir suavemente', () => {
    cy.visit('/food.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    cy.get('#foodName', { timeout: 10000 }).type('Teste Modal');
    cy.get('#foodQuantity').type('5');
    cy.get('#foodDate').type('2025-01-01');

    const startTime = Date.now();
    cy.get('button[type="submit"]').click();
    
    cy.get('.modal', { timeout: 10000 }).should('be.visible').then(() => {
      const modalTime = Date.now() - startTime;
      expect(modalTime).to.be.lessThan(3000); // Menos de 3 segundos para mobile
    });
  });

  it('Navegação entre páginas deve ser fluida', () => {
    cy.visit('/painel', {
      onBeforeLoad(win) {
        if (token) {
          win.localStorage.setItem('token', token);
        }
      },
    });
    
    // Testar apenas uma navegação
    const startTime = Date.now();
    
    cy.get('.row .col-12 a', { timeout: 10000 }).first().click();
    cy.url().should('include', '.html');
    
    cy.then(() => {
      const navTime = Date.now() - startTime;
      expect(navTime).to.be.lessThan(5000); // Menos de 5 segundos para mobile
    });
  });
});