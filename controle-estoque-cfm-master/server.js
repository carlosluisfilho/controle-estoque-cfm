const express = require('express');
const app = express();
const path = require('path');
const autenticarToken = require('./middleware/auth');

// 🔁 Rotas da API
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const foodRoutes = require('./routes/food');
const donationRoutes = require('./routes/donation');
const distributionRoutes = require('./routes/distribution');
const dashboardRoutes = require('./routes/dashboard');

// 🧠 Parsers de corpo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Arquivos estáticos (JS, CSS, imagens)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// 🌐 Rotas públicas (sem autenticação)
app.use('/auth', authRoutes);
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// 📄 Rotas HTML públicas (token validado no front-end via fetch)
app.get('/painel', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'))
);
app.get('/food.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'food.html'))
);
app.get('/donation.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'donation.html'))
);
app.get('/distribution.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'distribution.html'))
);

// 🔐 Rotas de API protegidas com JWT
app.use('/relatorios', autenticarToken, reportsRoutes);
app.use('/food', autenticarToken, foodRoutes);
app.use('/donation', autenticarToken, donationRoutes);
app.use('/distribution', autenticarToken, distributionRoutes);
app.use('/dashboard', autenticarToken, dashboardRoutes);

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

module.exports = { app, server };
