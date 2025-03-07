const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const SECRET_KEY = 'gled@1986'; // Substitua por uma chave forte e segura

// Registrar um novo usuário
async function registrarUsuario(username, password) {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(password, 10); // Criptografar a senha
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve({ id: this.lastID, username });
      }
    });
  });
}

// Fazer login de um usuário
async function loginUsuario(username, password) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, user) => {
      if (err) {
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

// Middleware de autenticação
function autenticarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Acesso negado.');

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Token inválido.');
    req.user = user; // Anexa os dados do usuário à requisição
    next();
  });
}

module.exports = { registrarUsuario, loginUsuario, autenticarToken };