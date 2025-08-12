require('dotenv').config();
const express = require('express');
const path = require('path');
const autenticarToken = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const corsMiddleware = require('./config/cors');
const logger = require('./utils/logger');
const healthMonitor = require('./middleware/healthMonitor');
const alertService = require('./services/alertService');
const app = express();

// 🔁 Rotas de API
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const foodRoutes = require('./routes/food');
const donationRoutes = require('./routes/donation');
const distributionRoutes = require('./routes/distribution');
const dashboardRoutes = require('./routes/dashboard');
const healthRoutes = require('./routes/health');
const monitoringRoutes = require('./routes/monitoring');
const cacheRoutes = require('./routes/cache');

// 🌐 CORS
app.use(corsMiddleware);

// 🛡️ Rate limiting
if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter);
}

// 📊 Monitoramento de saúde
app.use(healthMonitor.middleware());

// 🧠 Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// 🌐 Rotas de páginas públicas (HTML)
app.get('/login', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
);
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
);
app.get('/logout', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'logout.html'))
);

// 🌐 Rotas de páginas com token validado no front-end (fetch)
app.get('/painel', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'))
);
app.get('/food.html', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'food.html'))
);
app.get('/donation.html', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'donation.html'))
);
app.get('/distribution.html', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'distribution.html'))
);
app.get('/monitoring', (_, res) =>
  res.sendFile(path.join(__dirname, 'views', 'monitoring.html'))
);

// 🔐 Rotas de API protegidas
app.use('/dashboard', autenticarToken, dashboardRoutes);
app.use('/food', autenticarToken, foodRoutes);
app.use('/donation', autenticarToken, donationRoutes);
app.use('/distribution', autenticarToken, distributionRoutes);
app.use('/relatorios', autenticarToken, reportsRoutes);

// 🔓 Rotas de API públicas
app.use('/auth', authRoutes);
app.use('/api', healthRoutes);
app.use('/api', monitoringRoutes);
app.use('/api/cache', cacheRoutes);

// 🚨 Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// 🚀 Inicialização
let server;
const PORT = process.env.PORT || 3001;

// Não inicializar automaticamente em modo de teste
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    logger.info('Servidor iniciado', { port: PORT, env: process.env.NODE_ENV });
    
    // Iniciar monitoramento de sistema
    alertService.monitorSystemHealth();
  });
} else {
  console.log('Modo de teste - servidor não iniciado automaticamente');
}

// Função para inicializar servidor em testes
function startTestServer(port = PORT) {
  // Garantir que está em modo de teste
  process.env.NODE_ENV = 'test';
  
  const { exec } = require('child_process');
  const isWindows = process.platform === 'win32';
  
  return new Promise((resolve, reject) => {
    const findCommand = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti :${port}`;

    exec(findCommand, (err, stdout) => {
      if (stdout && stdout.trim()) {
        const pids = stdout.trim().split('\n').map(line => {
          if (isWindows) {
            const parts = line.trim().split(/\s+/);
            return parts[parts.length - 1];
          }
          return line.trim();
        }).filter(pid => pid && pid !== '0');

        if (pids.length > 0) {
          const killCommand = isWindows
            ? `taskkill /F ${pids.map(pid => `/PID ${pid}`).join(' ')}`
            : `kill -9 ${pids.join(' ')}`;
          
          exec(killCommand, () => {
            setTimeout(() => startServer(), 1000);
          });
        } else {
          startServer();
        }
      } else {
        startServer();
      }
    });

    function startServer() {
      server = app.listen(port, () => {
        console.log(`✅ Servidor de teste iniciado na porta ${port}`);
        resolve(server);
      });

      server.on('error', (err) => {
        reject(err);
      });
    }
  });
}

// Função para parar servidor em testes
function stopTestServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('🛑 Servidor de teste encerrado');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = { app, server, startTestServer, stopTestServer };
