const cors = require('cors');

// Define as opções de configuração do CORS
const corsOptions = {
  // Função que verifica se a origem da requisição está autorizada
  origin: function (origin, callback) {
    // Define lista de origens permitidas a partir da variável de ambiente CORS_ORIGIN
    // Se não definida, usa valores padrão para desenvolvimento local
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3001', 'http://127.0.0.1:3001'];
    
    // Permite requisições sem origem definida (ex: apps mobile, Postman)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista de permitidas
    // Se sim, permite a requisição (callback com true)
    // Se não, retorna erro de CORS
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  // Permite envio de credenciais nas requisições (cookies, headers de autenticação)
  credentials: true,
  // Define os métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Define os headers permitidos nas requisições
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  // Define código de status de sucesso para requisições OPTIONS
  optionsSuccessStatus: 200
};

// Exporta o middleware configurado para ser usado na aplicação
module.exports = cors(corsOptions);