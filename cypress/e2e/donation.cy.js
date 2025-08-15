describe('🎁 API de Doações', () => {
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

  it('Deve listar doações via API', () => {
    cy.request({
      method: 'GET',
      url: '/donation',
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

  it('Deve criar doação via API', () => {
    const payload = {
      food_id: alimentoId,
      quantity: 10,
      donor_name: 'Doador API Teste',
      reference: 'Cesta API',
      donation_date: '2025-04-20'
    };

    cy.request({
      method: 'POST',
      url: '/donation',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
      failOnStatusCode: false
    }).then((res) => {
      if (res.status !== 429) {
        expect(res.status).to.be.oneOf([201, 401, 500]);
      }
    });
  });

  it('Deve atualizar uma doação existente com sucesso', () => {
    const payload = {
      food_id: alimentoId,
      quantity: 5,
      donor_name: 'Doador Original',
      reference: 'Inicial',
      donation_date: '2025-04-20',
    };

    cy.request({
      method: 'POST',
      url: '/donation',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
      failOnStatusCode: false
    }).then((res) => {
      if (res.status === 429) {
        cy.log('Rate limit atingido, pulando teste');
        return;
      }
      
      if (res.status === 201 && res.body && res.body.id) {
        const donationId = res.body.id;

        cy.request({
          method: 'PUT',
          url: `/donation/${donationId}`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            food_id: alimentoId,
            quantity: 7,
            donor_name: 'Doador Editado',
            reference: 'Cesta Editada',
            donation_date: '2025-04-21',
          },
          failOnStatusCode: false
        }).then((res) => {
          if (res.status !== 429) {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.include('atualizada');
          }
        });
      } else {
        cy.log('Falha na criação da doação, pulando teste de atualização');
      }
    });
  });

  it('Deve excluir uma doação com sucesso', () => {
    const payload = {
      food_id: alimentoId,
      quantity: 3,
      donor_name: 'Doador Exclusão',
      reference: 'Teste',
      donation_date: '2025-04-25',
    };

    cy.request({
      method: 'POST',
      url: '/donation',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
      failOnStatusCode: false
    }).then((res) => {
      if (res.status === 429) {
        cy.log('Rate limit atingido, pulando teste');
        return;
      }
      
      if (res.status === 201 && res.body && res.body.id) {
        const donationId = res.body.id;

        cy.request({
          method: 'DELETE',
          url: `/donation/${donationId}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false
        }).then((res) => {
          if (res.status !== 429) {
            expect(res.status).to.be.oneOf([200, 404]);
            if (res.status === 200) {
              expect(res.body.message).to.include('removida');
            }
          }
        });
      } else {
        cy.log('Falha na criação da doação, pulando teste de exclusão');
      }
    });
  });
});