const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth"); // Middleware de autenticação
const router = express.Router();

// 🔄 Rota para obter os dados do painel
router.get("/", autenticarToken, async (req, res) => {
    try {
        const totalAlimentos = await contarRegistros("food");
        const totalDoacoes = await contarRegistros("donation");
        const totalDistribuicoes = await contarRegistros("distribution");

        res.json({
            totalAlimentos,
            totalDoacoes,
            totalDistribuicoes
        });
    } catch (error) {
        console.error("Erro ao buscar dados do painel:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados do painel." });
    }
});

// 📌 Função para contar registros de uma tabela
function contarRegistros(tabela) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS total FROM ${tabela}`, (err, row) => {
            if (err) reject(err);
            else resolve(row.total);
        });
    });
}

module.exports = router;
