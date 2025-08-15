const { spawn } = require('child_process');
// amazonq-ignore-next-line
const http = require('http');

console.log('🧪 Testando inicialização do servidor...');

// Iniciar servidor
const server = spawn('node', ['server.js'], {
  env: { ...process.env, NODE_ENV: 'test' },
  stdio: 'pipe'
});

server.stdout.on('data', (data) => {
  console.log('📤 STDOUT:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  console.log('📤 STDERR:', data.toString().trim());
});

// Aguardar 5 segundos e testar conexão
setTimeout(() => {
  console.log('🔍 Testando conexão...');
  
  const req = http.request({
    host: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    // amazonq-ignore-next-line
    console.log(`✅ Servidor respondeu com status: ${res.statusCode}`);
    server.kill('SIGINT');
    process.exit(0);
  });

  req.on('error', (err) => {
    console.log(`❌ Erro na conexão: ${encodeURIComponent(err.message)}`);
    server.kill('SIGINT');
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Timeout na conexão');
    req.destroy();
    server.kill('SIGINT');
    process.exit(1);
  });

  req.end();
}, 5000);

// Cleanup
process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});