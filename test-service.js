process.env.NODE_ENV = 'test';
const dashboardService = require('./services/dashboardService');

async function test() {
  try {
    console.log('🔍 Testando dashboardService...');
    
    const totais = await dashboardService.obterTotais();
    console.log('📊 Totais:', totais);
    
    const movimentacoes = await dashboardService.obterUltimasMovimentacoes();
    console.log('📋 Alimentos:', movimentacoes.alimentos);
    console.log('🎁 Doações:', movimentacoes.doacoes);
    console.log('📤 Distribuições:', movimentacoes.distribuicoes);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error.stack);
  }
  
  process.exit(0);
}

test();