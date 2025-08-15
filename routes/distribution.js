// routes/distribution.js (refatorado)
const express = require("express");
const { body, validationResult } = require("express-validator");
const autenticarToken = require("../middleware/auth");
const { asyncHandler } = require('../middleware/errorHandler');
const distributionService = require("../services/distributionService");
const { commonValidations } = require("../utils/validationUtils");

const router = express.Router();

// ✅ Criar nova distribuição
router.post(
  "/",
  autenticarToken,
  commonValidations.foodId,
  commonValidations.quantity,
  body("house_name").isString().notEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await distributionService.criarDistribuicao(req.body);
    res.status(201).json(result);
  })
);

// ✅ Buscar todas as distribuições
router.get("/", autenticarToken, asyncHandler(async (req, res) => {
  const rows = await distributionService.listarDistribuicoes();
  res.status(200).json(rows);
}));

// ✅ Atualizar distribuição
router.put(
  "/:id",
  autenticarToken,
  commonValidations.foodId,
  commonValidations.quantity,
  body("house_name").isString().notEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await distributionService.atualizarDistribuicao(parseInt(req.params.id, 10), req.body);
    res.status(200).json({ message: "Distribuição atualizada com sucesso." });
  })
);

// ✅ Excluir distribuição
router.delete("/:id", autenticarToken, asyncHandler(async (req, res) => {
  await distributionService.removerDistribuicao(parseInt(req.params.id, 10));
  res.status(200).json({ message: "Distribuição removida com sucesso." });
}));

module.exports = router;