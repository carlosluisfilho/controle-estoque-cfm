const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth");

const router = express.Router();

// ✅ Criar nova distribuição
router.post("/", autenticarToken, (req, res) => {
  const { food_id, quantity, house_name } = req.body;

  if (!food_id || !quantity || !house_name) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }

  const sql = `
    INSERT INTO distribution (food_id, quantity, house_name)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [food_id, quantity, house_name], function (err) {
    if (err) {
      console.error("Erro ao registrar distribuição:", err.message);
      return res.status(500).json({ error: "Erro ao registrar distribuição." });
    }

    res.status(201).json({ id: this.lastID, food_id, quantity, house_name });
  });
});

// ✅ Buscar todas as distribuições
router.get("/", autenticarToken, (req, res) => {
  db.all(`
    SELECT 
      distribution.id, 
      food.name AS food_name, 
      distribution.quantity, 
      distribution.house_name, 
      distribution.created_at
    FROM distribution
    JOIN food ON distribution.food_id = food.id
    ORDER BY distribution.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar distribuições:", err.message);
      return res.status(500).json({ error: "Erro ao buscar distribuições." });
    }

    res.status(200).json(rows);
  });
});

// ✅ Atualizar distribuição
router.put("/:id", autenticarToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { food_id, quantity, house_name, created_at } = req.body;

  if (!food_id || !quantity || !house_name || !created_at) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    UPDATE distribution
    SET food_id = ?, quantity = ?, house_name = ?, created_at = ?
    WHERE id = ?
  `;

  db.run(sql, [food_id, quantity, house_name, created_at, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar distribuição:", err.message);
      return res.status(500).json({ error: "Erro ao atualizar distribuição." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Distribuição não encontrada." });
    }

    res.status(200).json({ message: "Distribuição atualizada com sucesso." });
  });
});

// ✅ Excluir distribuição
router.delete("/:id", autenticarToken, (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.run("DELETE FROM distribution WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Erro ao excluir distribuição:", err.message);
      return res.status(500).json({ error: "Erro ao excluir distribuição." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Distribuição não encontrada." });
    }

    res.status(200).json({ message: "Distribuição removida e estoque ajustado." });
  });
});

module.exports = router;
