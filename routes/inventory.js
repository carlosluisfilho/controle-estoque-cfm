const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth");
const router = express.Router();

// 📦 Rota para obter o estoque de alimentos
router.get("/", autenticarToken, async (req, res) => {
    try {
        db.all("SELECT id, name, quantity, updated_at AS lastUpdated FROM food", [], (err, rows) => {

            if (err) {
                console.error("Erro ao buscar estoque:", err.message);
                return res.status(500).json({ error: "Erro ao buscar estoque." });
            }
            res.json(rows);
        });
    } catch (error) {
        console.error("Erro interno no servidor:", error.message);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

module.exports = router;