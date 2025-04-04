describe('🔐 Testes de Autenticação', () => {
  
    beforeEach(() => {
      cy.visit('http://localhost:3001/login'); // Acessa a página de login antes de cada teste
    });
  
    it('✅ Deve fazer login com credenciais corretas', () => {
      cy.get('#username').type('admin'); // Preenche o campo usuário
      cy.get('#password').type('123456'); // Preenche a senha
      cy.get('button[type="submit"]').click(); // Clica no botão de login
  
      cy.url().should('eq', 'http://localhost:3001/painel'); // Confirma redirecionamento para o painel
    });
  
    it('❌ Deve exibir erro ao tentar login com credenciais inválidas', () => {
      cy.get('#username').type('admin');
      cy.get('#password').type('senhaErrada');
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Usuário ou senha incorretos.');
      });
    });
  
   
  });
  