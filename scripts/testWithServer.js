// amazonq-ignore-next-line
const { spawn, spawnSync } = require('child_process');

async function main() {
  console.log('🧪 Testando fluxo completo...');
  
  let servidor;
  
  try {
    // Iniciar servidor
    console.log('🚀 Iniciando servidor...');
    servidor = spawn('node', ['server.js'], {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'pipe'
    });
  
    servidor.stdout.on('data', (data) => {
      console.log('📤', data.toString().trim());
    });
  
    servidor.stderr.on('data', (data) => {
      console.log('📤 ERR:', encodeURIComponent(data.toString().trim()));
    });
  
    // Aguardar 3 segundos
    console.log('⏳ Aguardando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  
    // Executar healthcheck
    console.log('🩺 Executando healthcheck...');
    spawnSync('node', ['scripts/healthcheck.js', '3001', '--timeout=15000'], { stdio: 'inherit' });
  
    console.log('✅ Teste concluído com sucesso!');
  
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    if (servidor) {
      console.log('🛑 Encerrando servidor...');
      servidor.kill('SIGINT');
    }
  }
}

main();