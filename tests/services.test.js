const dashboardService = require('../services/dashboardService');
const foodService = require('../services/foodService');
const donationService = require('../services/donationService');
const distributionService = require('../services/distributionService');
const db = require('../database/db');

beforeAll(done => {
  db.serialize(() => {
    db.run('DELETE FROM distribution');
    db.run('DELETE FROM donation');
    db.run('DELETE FROM food');
    db.run(`
      INSERT INTO food (id, name, quantity, date, reference, purchase_value, expiration)
      VALUES (5000, 'Teste Service', 50, '2025-01-01', 'REF-SRV', 10.0, '2025-12-31')
    `, done);
  });
});

describe('🔧 Testes de Services', () => {

  describe('DashboardService', () => {
    test('✅ Obtém totais do dashboard', async () => {
      const totais = await dashboardService.obterTotais();
      expect(totais).toHaveProperty('alimentos');
      expect(totais).toHaveProperty('doacoes');
      expect(totais).toHaveProperty('distribuicoes');
    });

    test('✅ Obtém últimas movimentações', async () => {
      const movimentacoes = await dashboardService.obterUltimasMovimentacoes();
      expect(movimentacoes).toHaveProperty('alimentos');
      expect(movimentacoes).toHaveProperty('doacoes');
      expect(movimentacoes).toHaveProperty('distribuicoes');
    });
  });

  describe('FoodService', () => {
    test('✅ Busca alimentos', async () => {
      const alimentos = await foodService.buscarAlimentos();
      expect(Array.isArray(alimentos)).toBe(true);
    });

    test('✅ Busca alimentos por nome', async () => {
      const alimentos = await foodService.buscarAlimentos('Teste');
      expect(Array.isArray(alimentos)).toBe(true);
    });
  });

  describe('DonationService', () => {
    test('✅ Lista doações', async () => {
      const doacoes = await donationService.listarDoacoes();
      expect(Array.isArray(doacoes)).toBe(true);
    });

    test('✅ Cria doação', async () => {
      const doacao = await donationService.criarDoacao({
        food_id: 5000,
        quantity: 5,
        donor_name: 'Teste',
        reference: 'REF-SRV',
        expiration: '2025-12-31',
        donation_date: '2025-04-01'
      });
      expect(doacao).toHaveProperty('id');
    });
  });

  describe('DistributionService', () => {
    test('✅ Lista distribuições', async () => {
      const distribuicoes = await distributionService.listarDistribuicoes();
      expect(Array.isArray(distribuicoes)).toBe(true);
    });

    test('✅ Cria distribuição', async () => {
      const distribuicao = await distributionService.criarDistribuicao({
        food_id: 5000,
        quantity: 3,
        house_name: 'Casa Teste'
      });
      expect(distribuicao).toHaveProperty('id');
    });
  });
});