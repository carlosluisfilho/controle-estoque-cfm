// services/donationService.js
const db = require('../database/db');

async function criarDoacao({ food_id, quantity, donor_name, reference, expiration, donation_date }) {
  return new Promise((resolve, reject) => {
    const dataDoacao = donation_date || new Date().toISOString().slice(0, 10);
    const validadeItem = expiration || null;
    const sqlInsert = `
      INSERT INTO donation (food_id, quantity, donor_name, reference, expiration, donation_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sqlInsert,
      [food_id, quantity, donor_name || 'Anônimo', reference, validadeItem, dataDoacao],
      function (err) {
        if (err) return reject(err);

        const donationId = this.lastID;

        db.run(
          'UPDATE food SET quantity = quantity + ? WHERE id = ?',
          [quantity, food_id],
          function (updateErr) {
            if (updateErr) return reject(updateErr);
            resolve({
              id: donationId,
              food_id,
              quantity,
              donor_name,
              reference,
              expiration: validadeItem,
              donation_date: dataDoacao,
            });
          }
        );
      }
    );
  });
}

async function listarDoacoes() {
  return new Promise((resolve, reject) => {
    const sql = `
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
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function removerDoacao(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM donation WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject({ statusCode: 404, message: 'Doação não encontrada.' });

      db.run('DELETE FROM donation WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

async function atualizarDoacao(id, { food_id, quantity, donor_name, reference, expiration, donation_date }) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM donation WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject({ statusCode: 404, message: 'Doação não encontrada.' });

      const sql = `
        UPDATE donation
        SET food_id = ?, quantity = ?, donor_name = ?, reference = ?, expiration = ?, donation_date = ?
        WHERE id = ?
      `;
      db.run(
        sql,
        [food_id, quantity, donor_name, reference, expiration, donation_date, id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
}

module.exports = {
  criarDoacao,
  listarDoacoes,
  removerDoacao,
  atualizarDoacao,
};