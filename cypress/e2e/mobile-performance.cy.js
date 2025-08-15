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

    cy.get('#totalAlimentos').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(3000); // Menos de 3 segundos
    });
  });

  it('Formulários devem responder rapidamente', () => {
    cy.visit('/food.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    const startTime = Date.now();
    
    cy.get('#foodName').type('Teste Performance');
    cy.get('#foodQuantity').type('10');
    
    cy.then(() => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000); // Menos de 2 segundos
    });
  });

  it('Tabelas devem renderizar sem travamentos', () => {
    cy.visit('/food.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    // Verificar se tabela carrega sem delay excessivo
    cy.get('#foodTable tbody tr').should('have.length.greaterThan', 0);
    
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

    cy.get('#foodName').type('Teste Modal');
    cy.get('#foodQuantity').type('5');
    cy.get('#foodDate').type('2025-01-01');

    const startTime = Date.now();
    cy.get('button[type="submit"]').click();
    
    cy.get('.modal').should('be.visible').then(() => {
      const modalTime = Date.now() - startTime;
      expect(modalTime).to.be.lessThan(2000); // Menos de 2 segundos
    });
  });

  it('Navegação entre páginas deve ser fluida', () => {
    cy.visit('/painel', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    const pages = ['/food.html', '/donation.html', '/distribution.html'];
    
    // Testar apenas uma navegação
    const startTime = Date.now();
    
    cy.get('.row .col-12 a').first().click();
    cy.url().should('include', '.html');
    
    cy.then(() => {
      const navTime = Date.now() - startTime;
      expect(navTime).to.be.lessThan(3000); // Menos de 3 segundos
    });
  });
});