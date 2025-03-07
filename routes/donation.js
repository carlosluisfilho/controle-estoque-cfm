const express = require('express');
const db = require('../database/db');
const autenticarToken = require('../middleware/auth');

const router = express.Router();


// Registrar uma doação e atualizar estoque
router.post("/", autenticarToken, (req, res) => {
  const { food_id, quantity, donor_name } = req.body;

  if (!food_id || !quantity) {
    console.error("⚠️ Erro: ID do alimento e quantidade são obrigatórios.");
    return res.status(400).json({ error: "ID do alimento e quantidade são obrigatórios." });
  }

  console.log("📝 Criando doação - Food ID:", food_id, "Quantidade:", quantity, "Doador:", donor_name);

  const sqlInsert = "INSERT INTO donation (food_id, quantity, donor_name) VALUES (?, ?, ?)";

  db.run(sqlInsert, [food_id, quantity, donor_name || "Anônimo"], function (err) {
    if (err) {
      console.error("🔥 Erro ao registrar doação:", err.message);
      return res.status(500).json({ error: "Erro ao registrar doação." });
    }

    console.log("✅ Doação registrada com sucesso! ID:", this.lastID);
    
    // 🔥 Agora atualiza o estoque do alimento corretamente
    const sqlUpdate = "UPDATE food SET quantity = quantity + ? WHERE id = ?";
    db.run(sqlUpdate, [quantity, food_id], function (updateErr) {
      if (updateErr) {
        console.error("⚠️ Erro ao atualizar estoque:", updateErr.message);
        return res.status(500).json({ error: "Erro ao atualizar estoque." });
      }

      console.log("📦 Estoque atualizado para o alimento ID:", food_id);
      res.status(201).json({ id: this.lastID, food_id, quantity, donor_name });
    });
  });
});
// ✅ Buscar histórico de doações
router.get('/', autenticarToken, (req, res) => {
    db.all(`
        SELECT 
            donation.id, 
            food.name AS food_name, 
            donation.quantity, 
            donation.donor_name, 
            donation.created_at 
        FROM donation
        JOIN food ON donation.food_id = food.id
        ORDER BY donation.created_at DESC
    `, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar doações:', err);
            return res.status(500).json({ error: 'Erro ao buscar doações.' });
        }
        res.json(rows);
    });
});
// 🔍 Buscar alimento pelo nome
async function searchFood() {
    const foodName = document.getElementById('searchFood').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!foodName) {
        searchResult.innerHTML = '⚠️ Digite um nome para buscar!';
        searchResult.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`/food/search?name=${encodeURIComponent(foodName)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();

        if (response.ok && data) {
            searchResult.innerHTML = `✅ <b>${data.name}</b> encontrado! Quantidade disponível: <b>${data.quantity}</b>`;
            searchResult.style.color = 'green';

            // Preencher automaticamente o ID no campo do formulário
            document.getElementById('donationFoodId').value = data.id;
        } else {
            searchResult.innerHTML = '❌ Alimento não encontrado!';
            searchResult.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao buscar alimento:', error);
        searchResult.innerHTML = '❌ Erro ao buscar alimento!';
        searchResult.style.color = 'red';
    }
}

router.delete("/:id", autenticarToken, (req, res) => {
    const { id } = req.params;
  
    db.get("SELECT id FROM donation WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("Erro ao buscar doação:", err.message);
        return res.status(500).json({ error: "Erro no servidor." });
      }
  
      if (!row) {
        return res.status(404).json({ error: "Doação não encontrada." });
      }
  
      db.run("DELETE FROM donation WHERE id = ?", [id], function (err) {
        if (err) {
          console.error("Erro ao excluir doação:", err.message);
          return res.status(500).json({ error: "Erro ao excluir doação." });
        }
  
        res.json({ message: "Doação removida com sucesso." });
      });
    });
  });  

module.exports = router;

