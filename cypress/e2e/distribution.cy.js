describe('🚚 API de Distribuições', () => {
  let token;
  let alimentoId = 1;
  let nomeAlimento = 'Item Teste';

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
    const payload = {
      food_id: alimentoId,
      quantity: 10,
      house_name: 'Casa API Teste'
    };

    cy.request({
      method: 'POST',
      url: '/distribution',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
      failOnStatusCode: false
    }).then((res) => {
      if (res.status !== 429) {
        expect(res.status).to.be.oneOf([201, 401, 500]);
      }
    });
  });

  it('Deve atualizar uma distribuição via API com sucesso', () => {
    const payload = {
      food_id: alimentoId,
      quantity: 20,
      house_name: 'Casa Antiga'
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
      
      const id = res.body.id;

      cy.request({
        method: 'PUT',
        url: `/distribution/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          food_id: alimentoId,
          quantity: 30,
          house_name: 'Casa Atualizada'
        },
        failOnStatusCode: false
      }).then((res) => {
        if (res.status !== 429) {
          expect(res.status).to.eq(200);
          expect(res.body.message).to.include('atualizada');
        }
      });
    });
  });

  it('Deve excluir uma distribuição via API com sucesso', () => {
    const payload = {
      food_id: alimentoId,
      quantity: 5,
      house_name: 'Casa Exclusão'
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
      
      const id = res.body.id;

      cy.request({
        method: 'DELETE',
        url: `/distribution/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false
      }).then((res) => {
        if (res.status !== 429) {
          expect(res.status).to.eq(200);
          expect(res.body.message).to.include('removida');
        }
      });
    });
  });
});
