const express = require('express');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secreta';

// Login de usuário
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

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