// routes/distribution.js (refatorado)
const express = require("express");
const { body, validationResult } = require("express-validator");
const autenticarToken = require("../middleware/auth");
const distributionService = require("../services/distributionService");

const router = express.Router();

// ✅ Criar nova distribuição
router.post(
  "/",
  autenticarToken,
  body("food_id").isInt({ min: 1 }),
  body("quantity").isFloat({ gt: 0 }),
  body("house_name").isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await distributionService.criarDistribuicao(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error("Erro ao registrar distribuição:", err.message);
      res.status(500).json({ error: "Erro ao registrar distribuição." });
    }
  }
);

// ✅ Buscar todas as distribuições
router.get("/", autenticarToken, async (req, res) => {
  try {
    const rows = await distributionService.listarDistribuicoes();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar distribuições:", err.message);
    res.status(500).json({ error: "Erro ao buscar distribuições." });
  }
});

// ✅ Atualizar distribuição
router.put(
  "/:id",
  autenticarToken,
  body("food_id").isInt({ min: 1 }),
  body("quantity").isFloat({ gt: 0 }),
  body("house_name").isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await distributionService.atualizarDistribuicao(parseInt(req.params.id, 10), req.body);
      res.status(200).json({ message: "Distribuição atualizada com sucesso." });
    } catch (err) {
      console.error("Erro ao atualizar distribuição:", err.message);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
);

// ✅ Excluir distribuição
router.delete("/:id", autenticarToken, async (req, res) => {
  try {
    await distributionService.removerDistribuicao(parseInt(req.params.id, 10));
    res.status(200).json({ message: "Distribuição removida com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir distribuição:", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;