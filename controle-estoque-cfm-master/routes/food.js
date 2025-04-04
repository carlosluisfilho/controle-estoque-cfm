
const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth");
const router = express.Router();

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

// 🔍 Buscar alimentos (com ou sem filtro por nome)
router.get("/", autenticarToken, (req, res) => {
  const { name } = req.query;
  const sql = name
    ? "SELECT * FROM food WHERE name LIKE ?"
    : "SELECT * FROM food";
  const params = name ? [`%${name}%`] : [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar alimentos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alimentos." });
    }
    const rowsFormatadas = rows.map(row => ({
      ...row,
      date: formatDate(row.date),
      expiration: formatDate(row.expiration)
    }));
    res.json(rowsFormatadas);
  });
});

// ➕ Adicionar ou atualizar alimento
router.post("/", autenticarToken, (req, res) => {
  const {
    name,
    quantity,
    date,
    reference,
    purchase_value,
    expiration
  } = req.body;

  if (!name || !quantity || !date || !reference || !purchase_value || !expiration) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  db.get("SELECT * FROM food WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error("Erro ao verificar alimento:", err.message);
      return res.status(500).json({ error: "Erro ao verificar alimento." });
    }

    if (row) {
      const newQuantity = row.quantity + parseInt(quantity, 10);
      db.run(
        `UPDATE food SET quantity = ?, date = ?, reference = ?, purchase_value = ?, expiration = ? WHERE id = ?`,
        [newQuantity, date, reference, purchase_value, expiration, row.id],
        function (err) {
          if (err) {
            console.error("Erro ao atualizar alimento:", err.message);
            return res.status(500).json({ error: "Erro ao atualizar alimento." });
          }
          res.status(201).json({
            id: row.id,
            name,
            quantity: newQuantity,
            message: "Estoque atualizado com sucesso!"
          });
        }
      );
    } else {
      db.run(
        `INSERT INTO food (name, quantity, date, reference, purchase_value, expiration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, quantity, date, reference, purchase_value, expiration],
        function (err) {
          if (err) {
            console.error("Erro ao adicionar alimento:", err.message);
            return res.status(500).json({ error: "Erro ao adicionar alimento." });
          }
          res.status(201).json({
            id: this.lastID,
            name,
            quantity,
            message: "Alimento cadastrado com sucesso!"
          });
        }
      );
    }
  });
});

// ✏️ Atualizar alimento por ID
router.put("/:id", autenticarToken, (req, res) => {
  const { id } = req.params;
  const {
    name,
    quantity,
    date,
    reference,
    purchase_value,
    expiration
  } = req.body;

  if (!name || !quantity || !date || !reference || !purchase_value || !expiration) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  db.get("SELECT * FROM food WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar alimento:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alimento." });
    }
    if (!row) {
      return res.status(404).json({ error: "Alimento não encontrado." });
    }

    db.run(
      `UPDATE food
       SET name = ?, quantity = ?, date = ?, reference = ?, purchase_value = ?, expiration = ?
       WHERE id = ?`,
      [name, quantity, date, reference, purchase_value, expiration, id],
      function (err) {
        if (err) {
          console.error("Erro ao atualizar alimento:", err.message);
          return res.status(500).json({ error: "Erro ao atualizar alimento." });
        }
        res.json({ message: "Alimento atualizado com sucesso." });
      }
    );
  });
});

// 🗑️ Excluir alimento por ID
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

module.exports = router;
