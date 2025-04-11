const express = require('express');
const path = require('path');
const autenticarToken = require('./middleware/auth');
const app = express();

// 🔁 Rotas de API
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const foodRoutes = require('./routes/food');
const donationRoutes = require('./routes/donation');
const distributionRoutes = require('./routes/distribution');
const dashboardRoutes = require('./routes/dashboard');

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

// 🔐 Rotas de API protegidas
app.use('/dashboard', autenticarToken, dashboardRoutes);
app.use('/food', autenticarToken, foodRoutes);
app.use('/donation', autenticarToken, donationRoutes);
app.use('/distribution', autenticarToken, distributionRoutes);
app.use('/relatorios', autenticarToken, reportsRoutes);

// 🔓 Rotas de API públicas
app.use('/auth', authRoutes);

// 🚀 Inicialização
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

module.exports = { app, server };
