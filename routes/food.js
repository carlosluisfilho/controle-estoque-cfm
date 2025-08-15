// routes/food.js (refatorado)
const express = require("express");
const { body, query } = require("express-validator");
const autenticarToken = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors, sanitizeRequestBody } = require('../middleware/validation');
const foodService = require("../services/foodService");
const { formatDate } = require("../utils/dateUtils");
const { commonValidations } = require("../utils/validationUtils");

const router = express.Router();

// 🔍 Buscar alimentos (com ou sem filtro por nome)
router.get("/",
  autenticarToken,
  query("name").optional().isString(),
  query("search").optional().isString(),
  asyncHandler(async (req, res) => {
    const { name, search } = req.query;
    const searchTerm = name || search;
    const alimentos = await foodService.buscarAlimentos(searchTerm);
    const formatados = alimentos.map(row => ({
      ...row,
      date: formatDate(row.date),
      expiration: formatDate(row.expiration)
    }));
    res.json(formatados);
  }));

// ➕ Adicionar ou atualizar alimento por nome
router.post("/",
  autenticarToken,
  sanitizeRequestBody,
  commonValidations.name,
  body("quantity").isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo'),
  commonValidations.date,
  commonValidations.reference,
  commonValidations.purchaseValue,
  commonValidations.expiration,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const result = await foodService.adicionarOuAtualizarPorNome(req.body);
    res.status(201).json(result);
  }));

// ✏️ Atualizar alimento por ID
router.put("/:id",
  autenticarToken,
  sanitizeRequestBody,
  commonValidations.id,
  commonValidations.name,
  body("quantity").isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro não negativo'),
  commonValidations.date,
  commonValidations.reference,
  commonValidations.purchaseValue,
  commonValidations.expiration,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    await foodService.atualizarPorId(parseInt(req.params.id, 10), req.body);
    res.json({ message: "Alimento atualizado com sucesso." });
  }));

// 🗑️ Excluir alimento por ID
router.delete("/:id", 
  autenticarToken, 
  commonValidations.id,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    await foodService.removerPorId(parseInt(req.params.id, 10));
    res.json({ message: "Alimento removido com sucesso." });
  }));

module.exports = router;