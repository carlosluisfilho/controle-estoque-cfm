const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const path = require('path');

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

async function setupELK() {
  try {
    console.log('🔍 Verificando conexão com Elasticsearch...');
    await client.ping();
    console.log('✅ Elasticsearch conectado');

    // Criar index template
    console.log('📋 Criando template de índice...');
    await client.indices.putIndexTemplate({
      name: 'cfm-estoque-template',
      index_patterns: ['cfm-estoque-logs-*'],
      template: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
          'index.refresh_interval': '5s'
        },
        mappings: {
          properties: {
            '@timestamp': { type: 'date' },
            level: { type: 'keyword' },
            message: { type: 'text' },
            service: { type: 'keyword' },
            environment: { type: 'keyword' },
            ip: { type: 'ip' },
            url: { type: 'keyword' },
            method: { type: 'keyword' },
            statusCode: { type: 'integer' },
            stack: { type: 'text' }
          }
        }
      }
    });
    console.log('✅ Template criado');

    // Importar dashboard do Kibana (se disponível)
    const dashboardPath = path.join(__dirname, '../config/kibana-dashboard.json');
    if (fs.existsSync(dashboardPath)) {
      console.log('📊 Dashboard do Kibana disponível em:', dashboardPath);
      console.log('💡 Importe manualmente via Kibana UI: Stack Management > Saved Objects');
    }

    console.log('🎉 Setup do ELK Stack concluído!');
    console.log('🌐 Acesse o Kibana em: http://localhost:5601');
    
  } catch (error) {
    console.error('❌ Erro no setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupELK();
}

module.exports = { setupELK };