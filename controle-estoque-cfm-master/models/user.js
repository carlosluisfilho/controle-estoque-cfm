// Importa os módulos necessários
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Usa uma variável de ambiente para a chave secreta, com um valor padrão 'secreta'
const SECRET_KEY = process.env.JWT_SECRET || 'gled@1986'; // Substitua por uma chave forte e segura

/**
 * Registra um novo usuário no banco de dados.
 * 
 * @param {string} username - O nome de usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<Object>} - Uma promessa que é resolvida com os detalhes do usuário registrado.
 */
async function registrarUsuario(username, password) {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(password, 10); // Criptografar a senha
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        console.error("❌ Erro ao registrar usuário:", err.message);
        reject(err.message);
      } else {
        resolve({ id: this.lastID, username });
      }
    });
  });
}

/**
 * Faz login de um usuário.
 * 
 * @param {string} username - O nome de usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<Object>} - Uma promessa que é resolvida com o token JWT e o nome de usuário.
 */
async function loginUsuario(username, password) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, user) => {
      if (err) {
        console.error("❌ Erro ao fazer login:", err.message);
        reject(err.message);
      } else if (!user || !bcrypt.compareSync(password, user.password)) {
        reject('Usuário ou senha incorretos.');
      } else {
        // Gerar um token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        resolve({ token, username: user.username });
      }
    });
  });
}

/**
 * Middleware de autenticação.
 * 
 * @param {Object} req - O objeto de solicitação HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - A função de callback para passar o controle para o próximo middleware.
 */
function autenticarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Acesso negado.');

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
    if (err) {
      console.error("❌ Erro ao verificar token:", err.message);
      return res.status(403).send('Token inválido.');
    }
    req.user = user; // Anexa os dados do usuário à requisição
    next();
  });
}

// Exporta as funções para serem usadas em outras partes da aplicação
module.exports = { registrarUsuario, loginUsuario, autenticarToken };