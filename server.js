const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const autenticarToken = require('./middleware/auth'); // Certifique-se que este arquivo existe

// Importando rotas corretamente
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const foodRoutes = require('./routes/food');
const donationRoutes = require('./routes/donation');
const distributionRoutes = require('./routes/distribution');
const dashboardRoutes = require('./routes/dashboard'); // 🔥 Verifique se esse arquivo existe
const inventoryRoutes = require("./routes/inventory");

app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas públicas
app.use('/auth', authRoutes);
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// 🚀 **Rotas protegidas**
app.use('/relatorios', autenticarToken, reportsRoutes);
app.use('/food', autenticarToken, foodRoutes);
app.use('/donation', autenticarToken, donationRoutes);
app.use('/distribution', autenticarToken, distributionRoutes);
app.use('/dashboard', autenticarToken, dashboardRoutes);  // **Verifique se dashboardRoutes não é undefined**
app.use("/inventory", autenticarToken, inventoryRoutes);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// ✅ Exportamos `server` corretamente
module.exports = { app, server };