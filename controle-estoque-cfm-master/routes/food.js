// routes/food.js (refatorado)
const express = require("express");
const { body, query, validationResult } = require("express-validator");
const autenticarToken = require("../middleware/auth");
const foodService = require("../services/foodService");

const router = express.Router();

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

// 🔍 Buscar alimentos (com ou sem filtro por nome)
router.get("/",
  autenticarToken,
  query("name").optional().isString(),
  async (req, res) => {
    const { name } = req.query;
    try {
      const alimentos = await foodService.buscarAlimentos(name);
      const formatados = alimentos.map(row => ({
        ...row,
        date: formatDate(row.date),
        expiration: formatDate(row.expiration)
      }));
      res.json(formatados);
    } catch (err) {
      console.error("Erro ao buscar alimentos:", err.message);
      res.status(500).json({ error: "Erro ao buscar alimentos." });
    }
  });

// ➕ Adicionar ou atualizar alimento por nome
router.post("/",
  autenticarToken,
  body("name").isString().notEmpty(),
  body("quantity").isInt({ min: 1 }),
  body("date").isISO8601(),
  body("reference").isString().notEmpty(),
  body("purchase_value").isFloat({ min: 0 }),
  body("expiration").isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await foodService.adicionarOuAtualizarPorNome(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error("Erro ao salvar alimento:", err.message);
      res.status(500).json({ error: "Erro ao salvar alimento." });
    }
  });

// ✏️ Atualizar alimento por ID
router.put("/:id",
  autenticarToken,
  body("name").isString().notEmpty(),
  body("quantity").isInt({ min: 0 }),
  body("date").isISO8601(),
  body("reference").isString().notEmpty(),
  body("purchase_value").isFloat({ min: 0 }),
  body("expiration").isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await foodService.atualizarPorId(parseInt(req.params.id, 10), req.body);
      res.json({ message: "Alimento atualizado com sucesso." });
    } catch (err) {
      console.error("Erro ao atualizar alimento:", err.message);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  });

// 🗑️ Excluir alimento por ID
router.delete("/:id", autenticarToken, async (req, res) => {
  try {
    await foodService.removerPorId(parseInt(req.params.id, 10));
    res.json({ message: "Alimento removido com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir alimento:", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;