const express = require('express');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

    // Comparar a senha com o hash armazenado no banco
    bcrypt.compare(password, user.password, (err, senhaCorreta) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err.message);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
      }

      // Gerar o token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, 'secreta', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
