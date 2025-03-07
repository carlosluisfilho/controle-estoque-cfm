const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 📋 Listar todas as distribuições
router.get('/', (req, res) => {
    db.all(`
        SELECT d.id, f.name AS food_name, d.quantity, d.house_name, d.created_at
        FROM distribution d
        JOIN food f ON d.food_id = f.id
        ORDER BY d.created_at DESC
    `, [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar distribuições:", err.message);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
        res.json(rows);
    });
});

// 📦 Registrar uma nova distribuição (com transação)
router.post('/', (req, res) => {
    const { food_id, quantity, house_name } = req.body;

    // 🚨 Validação de entrada
    if (!food_id || !quantity || !house_name) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    db.serialize(() => {
        db.get('SELECT quantity FROM food WHERE id = ?', [food_id], (err, row) => {
            if (err) {
                console.error("❌ Erro ao verificar estoque:", err.message);
                return res.status(500).json({ error: "Erro ao verificar estoque." });
            }
            if (!row || row.quantity < quantity) {
                return res.status(400).json({ error: 'Quantidade insuficiente no estoque.' });
            }

            db.run('BEGIN TRANSACTION'); // Inicia transação

            db.run(`
                INSERT INTO distribution (food_id, quantity, house_name) 
                VALUES (?, ?, ?)
            `, [food_id, quantity, house_name], function (err) {
                if (err) {
                    console.error("❌ Erro ao registrar distribuição:", err.message);
                    db.run('ROLLBACK'); // Cancela a transação
                    return res.status(500).json({ error: "Erro ao registrar distribuição." });
                }

                // Atualizar estoque
                db.run(`
                    UPDATE food SET quantity = quantity - ? WHERE id = ?
                `, [quantity, food_id], function (updateErr) {
                    if (updateErr) {
                        console.error("❌ Erro ao atualizar estoque:", updateErr.message);
                        db.run('ROLLBACK'); // Cancela a transação
                        return res.status(500).json({ error: "Erro ao atualizar estoque." });
                    }

                    db.run('COMMIT'); // Confirma transação
                    res.status(201).json({ id: this.lastID, message: "Distribuição registrada com sucesso!" });
                });
            });
        });
    });
});

// 🗑️ Deletar uma distribuição (ajusta estoque)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.serialize(() => {
        db.get('SELECT food_id, quantity FROM distribution WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error("❌ Erro ao buscar distribuição:", err.message);
                return res.status(500).json({ error: "Erro ao buscar distribuição." });
            }
            if (!row) {
                return res.status(404).json({ error: 'Distribuição não encontrada.' });
            }

            const { food_id, quantity } = row;

            db.run('BEGIN TRANSACTION'); // Inicia transação

            db.run('DELETE FROM distribution WHERE id = ?', [id], function (err) {
                if (err) {
                    console.error("❌ Erro ao remover distribuição:", err.message);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: "Erro ao remover distribuição." });
                }

                db.run('UPDATE food SET quantity = quantity + ? WHERE id = ?', [quantity, food_id], function (updateErr) {
                    if (updateErr) {
                        console.error("❌ Erro ao restaurar estoque:", updateErr.message);
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: "Erro ao restaurar estoque." });
                    }

                    db.run('COMMIT'); // Confirma transação
                    res.json({ message: "Distribuição removida e estoque ajustado.", deleted: this.changes });
                });
            });
        });
    });
});

module.exports = router;
