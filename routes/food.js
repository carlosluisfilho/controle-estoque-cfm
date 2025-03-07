const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth"); // Middleware de autenticação
const router = express.Router();

// Buscar alimento pelo nome (usado na busca antes de distribuir)
router.get("/", autenticarToken, (req, res) => {
  const { name } = req.query;

  if (name) {
      db.all("SELECT * FROM food WHERE name LIKE ?", [`%${name}%`], (err, rows) => {
          if (err) {
              console.error("Erro ao buscar alimento:", err.message);
              return res.status(500).json({ error: "Erro ao buscar alimento." });
          }
          return res.json(rows);
      });
  } else {
      db.all("SELECT * FROM food", [], (err, rows) => {
          if (err) {
              console.error("Erro ao buscar alimentos:", err.message);
              return res.status(500).json({ error: "Erro ao buscar alimentos." });
          }
          res.json(rows);
      });
  }
});

// Listar todos os alimentos
router.get("/", autenticarToken, (req, res) => {
  db.all("SELECT * FROM food", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar alimentos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alimentos." });
    }
    res.json(rows);
  });
});

// Adicionar ou atualizar alimento no estoque
router.post("/", autenticarToken, (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ error: "Nome e quantidade são obrigatórios." });
  }

  db.get("SELECT * FROM food WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error("Erro ao verificar alimento:", err.message);
      return res.status(500).json({ error: "Erro ao verificar alimento." });
    }

    if (row) {
      // Alimento já existe: atualizar a quantidade
      const newQuantity = row.quantity + parseInt(quantity, 10);
      db.run("UPDATE food SET quantity = ? WHERE id = ?", [newQuantity, row.id], function (err) {
        if (err) {
          console.error("Erro ao atualizar estoque:", err.message);
          return res.status(500).json({ error: "Erro ao atualizar estoque." });
        }
        return res.status(201).json({ id: row.id, name, quantity: newQuantity, message: "Estoque atualizado com sucesso!" });
      });
    } else {
      // Alimento não existe: inserir um novo
      db.run("INSERT INTO food (name, quantity) VALUES (?, ?)", [name, quantity], function (err) {
        if (err) {
          console.error("Erro ao adicionar alimento:", err.message);
          return res.status(500).json({ error: "Erro ao adicionar alimento." });
        }
        return res.status(201).json({ id: this.lastID, name, quantity, message: "Alimento cadastrado com sucesso!" });
      });
    }
  });
});

// Excluir alimento
router.delete("/:id", autenticarToken, (req, res) => {
  const { id } = req.params;

      db.run("DELETE FROM food WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Erro ao excluir alimento:", err.message);
            return res.status(500).json({ error: "Erro ao excluir alimento." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Alimento não encontrado." });
        }

        res.json({ message: "Alimento removido com sucesso." });
    });
});

// Atualizar Alimento
router.put("/:id", autenticarToken, (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  db.get("SELECT * FROM food WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar alimento:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alimento." });
    }

    if (!row) {
      return res.status(404).json({ error: "Alimento não encontrado." }); // ✅ Retorna erro correto
    }

    db.run(
      "UPDATE food SET name = ?, quantity = ? WHERE id = ?",
      [name, quantity, id],
      function (err) {
        if (err) {
          console.error("Erro ao atualizar alimento:", err.message);
          return res.status(500).json({ error: "Erro ao atualizar alimento." });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Alimento não encontrado." });
        }

        res.json({ message: "Alimento atualizado com sucesso." });
      }
    );
  });
});


module.exports = router;
