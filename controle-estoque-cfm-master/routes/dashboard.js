const express = require("express");
const db = require("../database/db");
const autenticarToken = require("../middleware/auth");
const router = express.Router();


function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
}

// 🔄 Rota para obter os dados do painel
router.get("/", autenticarToken, async (req, res) => {
    try {
        const totalAlimentos = await contarRegistros("food");
        const totalDoacoes = await contarRegistros("donation");
        const totalDistribuicoes = await contarRegistros("distribution");

        console.log("Total de alimentos:", totalAlimentos);
        console.log("Total de doações:", totalDoacoes);
        console.log("Total de distribuições:", totalDistribuicoes);

        const ultimosAlimentos = await buscarUltimos("food", "name, quantity, created_at");
        const ultimasDoacoes = await buscarUltimos("donation", "food_id, quantity, donor_name, created_at");
        const ultimasDistribuicoes = await buscarUltimos("distribution", "food_id, quantity, house_name, created_at");

        console.log("Últimos alimentos:", ultimosAlimentos);
        console.log("Últimas doações:", ultimasDoacoes);
        console.log("Últimas distribuições:", ultimasDistribuicoes);

        console.log("Dados retornados para o painel:", {
            totais: { totalAlimentos, totalDoacoes, totalDistribuicoes },
            ultimasMovimentacoes: { ultimosAlimentos, ultimasDoacoes, ultimasDistribuicoes }
        });

        res.json({
            totais: {
                alimentos: totalAlimentos || 0,
                doacoes: totalDoacoes || 0,
                distribuicoes: totalDistribuicoes || 0
            },
            ultimasMovimentacoes: {
                alimentos: ultimosAlimentos || [],
                doacoes: ultimasDoacoes || [],
                distribuicoes: ultimasDistribuicoes || []
            }
        });
    } catch (error) {
        console.error("Erro ao buscar dados do painel:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados do painel." });
    }
});

function contarRegistros(tabela) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS total FROM ${tabela}`, (err, row) => {
            if (err) reject(err);
            else resolve(row.total);
        });
    });
}

function buscarUltimos(tabela, campos) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT ${campos} FROM ${tabela} ORDER BY created_at DESC LIMIT 5`,
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

module.exports = router;