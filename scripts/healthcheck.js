// amazonq-ignore-next-line
const http = require('http');

// Parâmetros
const port = process.argv[2] || 3001;
const timeout = parseInt(process.argv[3]?.replace('--timeout=', '')) || 10000;
const start = Date.now();
let attempts = 0;

console.log(`🩺 Iniciando healthcheck na porta ${port} com timeout de ${timeout}ms...`);

const check = () => {
  attempts++;
  const elapsed = Date.now() - start;
  
  if (attempts % 10 === 0) {
    console.log(`⏳ Tentativa ${attempts} - ${elapsed}ms decorridos...`);
  }
  
  const req = http.request(
    {
      host: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 3000,
    },
    (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        console.log(`✅ Servidor está online (HTTP ${res.statusCode}) após ${attempts} tentativas`);
        process.exit(0);
      } else {
        console.log(`⚠️ Status inesperado: ${res.statusCode}`);
        retry();
      }
    }
  );

  req.on('error', (err) => {
    if (attempts === 1) {
      console.log(`🔍 Erro na primeira tentativa: ${err.code || err.message}`);
    }
    retry();
  });
  
  req.on('timeout', () => {
    req.destroy();
    retry();
  });

  req.end();
};

const retry = () => {
  if (Date.now() - start >= timeout) {
    console.error(`❌ Timeout: Servidor não respondeu após ${timeout}ms (${attempts} tentativas)`);
    process.exit(1);
  } else {
    setTimeout(check, 1000);
  }
};

check();
