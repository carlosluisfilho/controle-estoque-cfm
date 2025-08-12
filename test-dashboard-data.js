const { startTestServer } = require('./server');
const dashboardService = require('./services/dashboardService');

async function testDashboardData() {
  try {
    console.log('🔍 Testando dados do dashboard...');
    
    // Testar diretamente o service
    const totais = await dashboardService.obterTotais();
    console.log('📊 Totais:', totais);
    
    const movimentacoes = await dashboardService.obterUltimasMovimentacoes();
    console.log('📋 Movimentações:', JSON.stringify(movimentacoes, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testDashboardData();