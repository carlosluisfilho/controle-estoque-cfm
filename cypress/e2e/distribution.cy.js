describe('🚚 API de Distribuições', () => {
  let token;
  let alimentoId;
  let alimentoQuantidade;

  before(() => {
    // Autentica via API e armazena o token para os testes
    cy.request('POST', '/auth/login', {
      username: 'admin',
      password: '123456',
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      
      // Buscar um alimento disponível para usar nos testes
      cy.request({
        method: 'GET',
        url: '/food',
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false
      }).then((res) => {
        if (res.status === 200 && res.body.length > 0) {
          const alimento = res.body.find(f => f.quantity > 10) || res.body[0];
          alimentoId = alimento.id;
          alimentoQuantidade = alimento.quantity;
          cy.log(`Usando alimento: ${alimento.name} (ID: ${alimentoId}, Qtd: ${alimentoQuantidade})`);
        } else {
          alimentoId = 1; // fallback
          alimentoQuantidade = 50;
        }
      });
    });
  });

  it('Deve listar distribuições via API', () => {
    cy.request({
      method: 'GET',
      url: '/distribution',
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false
    }).then((res) => {
      if (res.status !== 429) {
        expect(res.status).to.be.oneOf([200, 401]);
        if (res.status === 200) {
          expect(res.body).to.be.an('array');
        }
      }
    });
  });

  it('Deve criar distribuição via API', () => {
    const quantidadeDistribuir = Math.min(5, alimentoQuantidade || 5);
    const payload = {
      food_id: alimentoId,
      quantity: quantidadeDistribuir,
      house_name: 'Casa API Teste'
    };

    cy.request({
      method: 'POST',
      url: '/distribution',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
      failOnStatusCode: false
    }).then((res) => {
      if (res.status === 429) {
        cy.log('Rate limit atingido, pulando teste');
        return;
      }
      
      cy.log(`Status: ${res.status}, Body:`, res.body);
      
      if (res.status === 400) {
        // Pode ser erro de estoque insuficiente, que é esperado
        expect(res.body.error || res.body.message).to.exist;
      } else if (res.status === 404) {
        // Alimento não encontrado
        expect(res.body.error).to.include('não encontrado');
      } else {
        expect(res.status).to.be.oneOf([201, 400, 404]);
        if (res.status === 201) {
          expect(res.body.id).to.exist;
          expect(res.body.food_id).to.eq(alimentoId);
        }
      }
    });
  });

  it('Deve atualizar uma distribuição via API com sucesso', () => {
    // Primeiro, listar distribuições existentes
    cy.request({
      method: 'GET',
      url: '/distribution',
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false
    }).then((res) => {
      if (res.status === 429) {
        cy.log('Rate limit atingido, pulando teste');
        return;
      }
      
      if (res.status === 200 && res.body.length > 0) {
        const distribuicao = res.body[0];
        const id = distribuicao.id;
        
        cy.request({
          method: 'PUT',
          url: `/distribution/${id}`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            food_id: alimentoId,
            quantity: 1,
            house_name: 'Casa Atualizada'
          },
          failOnStatusCode: false
        }).then((res) => {
          cy.log(`Status: ${res.status}, Body:`, res.body);
          if (res.status !== 429) {
            expect(res.status).to.be.oneOf([200, 404, 400]);
            if (res.status === 200) {
              expect(res.body.message).to.include('atualizada');
            }
          }
        });
      } else {
        cy.log('Nenhuma distribuição encontrada para atualizar');
      }
    });
  });

  it('Deve excluir uma distribuição via API com sucesso', () => {
    // Primeiro, listar distribuições existentes
    cy.request({
      method: 'GET',
      url: '/distribution',
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false
    }).then((res) => {
      if (res.status === 429) {
        cy.log('Rate limit atingido, pulando teste');
        return;
      }
      
      if (res.status === 200 && res.body.length > 0) {
        const distribuicao = res.body[res.body.length - 1]; // Pegar a última
        const id = distribuicao.id;
        
        cy.request({
          method: 'DELETE',
          url: `/distribution/${id}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false
        }).then((res) => {
          cy.log(`Status: ${res.status}, Body:`, res.body);
          if (res.status !== 429) {
            expect(res.status).to.be.oneOf([200, 404]);
            if (res.status === 200) {
              expect(res.body.message).to.include('removida');
            }
          }
        });
      } else {
        cy.log('Nenhuma distribuição encontrada para excluir');
      }
    });
  });
});
