const express = require('express');
const { body } = require('express-validator');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors, sanitizeRequestBody, preventBruteForce } = require('../middleware/validation');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET não configurado nas variáveis de ambiente');
  process.exit(1);
}

// Login de usuário
router.post('/login', 
  loginLimiter,
  preventBruteForce(5, 15 * 60 * 1000),
  sanitizeRequestBody,
  body('username').isLength({ min: 3, max: 50 }).withMessage('Usuário deve ter entre 3 e 50 caracteres').matches(/^[a-zA-Z0-9_]+$/).withMessage('Usuário deve conter apenas letras, números e underscore'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  handleValidationErrors,
  (req, res) => {
    const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Comparar a senha fornecida com o hash armazenado
    bcrypt.compare(password, user.password, (err, senhaCorreta) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err.message);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (!senhaCorreta) {
        return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    });
  });
});

module.exports = router;