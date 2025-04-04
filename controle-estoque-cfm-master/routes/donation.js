const express = require('express');
const db = require('../database/db');
const autenticarToken = require('../middleware/auth');

const router = express.Router();

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

// ✅ Criar uma nova doação
router.post("/", autenticarToken, (req, res) => {
  const {
    food_id,
    quantity,
    donor_name,
    reference,
    expiration,
    donation_date
  } = req.body;

  if (!food_id || !quantity || quantity <= 0) {
    console.error("⚠️ ID do alimento e quantidade válidos são obrigatórios.");
    return res.status(400).json({ error: "ID do alimento e quantidade são obrigatórios." });
  }

  const dataDoacao = donation_date || new Date().toISOString().slice(0, 10);
  const validadeItem = expiration || null;

  console.log("📝 Criando doação:", {
    food_id,
    quantity,
    donor_name,
    reference,
    expiration: validadeItem,
    donation_date: dataDoacao
  });

  const sqlInsert = `
    INSERT INTO donation (food_id, quantity, donor_name, reference, expiration, donation_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sqlInsert,
    [food_id, quantity, donor_name || "Anônimo", reference, validadeItem, dataDoacao],
    function (err) {
      if (err) {
        console.error("🔥 Erro ao registrar doação:", err.message);
        return res.status(500).json({ error: "Erro ao registrar doação." });
      }

      const donationId = this.lastID;
      console.log("✅ Doação registrada com sucesso! ID:", donationId);

      const sqlUpdate = "UPDATE food SET quantity = quantity + ? WHERE id = ?";
      db.run(sqlUpdate, [quantity, food_id], function (updateErr) {
        if (updateErr) {
          console.error("⚠️ Erro ao atualizar estoque:", updateErr.message);
          return res.status(500).json({ error: "Erro ao atualizar estoque." });
        }

        console.log("📦 Estoque atualizado para o alimento ID:", food_id);
        return res.status(201).json({
          id: donationId,
          food_id,
          quantity,
          donor_name,
          reference,
          expiration: formatDate(validadeItem),
          donation_date: formatDate(dataDoacao)
        });
      });
    }
  );
});

// ✅ Listar doações
router.get('/', autenticarToken, (req, res) => {
  db.all(`
    SELECT 
      donation.id, 
      food.name AS food_name, 
      donation.quantity, 
      donation.donor_name,
      donation.reference, 
      donation.expiration,
      donation.donation_date
    FROM donation
    JOIN food ON donation.food_id = food.id
    ORDER BY donation.donation_date DESC
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar doações:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar doações.' });
    }

    return res.json(rows.map(row => ({
      ...row,
      expiration: formatDate(row.expiration),
      donation_date: formatDate(row.donation_date)
    })));
  });
});

// ✅ Remover doação
router.delete("/:id", autenticarToken, (req, res) => {
  const { id } = req.params;

  db.get("SELECT id FROM donation WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("❌ Erro ao buscar doação:", err.message);
      return res.status(500).json({ error: "Erro ao buscar doação." });
    }

    if (!row) {
      return res.status(404).json({ error: "Doação não encontrada." });
    }

    db.run("DELETE FROM donation WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("❌ Erro ao excluir doação:", err.message);
        return res.status(500).json({ error: "Erro ao excluir doação." });
      }

      console.log(`🗑️ Doação ID ${id} excluída com sucesso.`);
      return res.json({ message: "Doação removida com sucesso." });
    });
  });
});

// ✅ Atualizar doação
router.put("/:id", autenticarToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    food_id,
    quantity,
    donor_name,
    reference,
    expiration,
    donation_date
  } = req.body;

  if (!food_id || !quantity || !donor_name || !reference || !donation_date) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  db.get("SELECT * FROM donation WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("❌ Erro ao buscar doação:", err.message);
      return res.status(500).json({ error: "Erro ao buscar doação." });
    }

    if (!row) {
      return res.status(404).json({ error: "Doação não encontrada." });
    }

    const sql = `
      UPDATE donation
      SET food_id = ?, quantity = ?, donor_name = ?, reference = ?, expiration = ?, donation_date = ?
      WHERE id = ?
    `;

    db.run(sql, [food_id, quantity, donor_name, reference, expiration, donation_date, id], function (err) {
      if (err) {
        console.error("❌ Erro ao atualizar doação:", err.message);
        return res.status(500).json({ error: "Erro ao atualizar doação." });
      }

      console.log(`🔄 Doação ID ${id} atualizada com sucesso.`);
      return res.json({ message: "Doação atualizada com sucesso." });
    });
  });
});

module.exports = router;
