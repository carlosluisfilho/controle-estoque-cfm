// services/foodService.js
const db = require("../database/db");

function buscarAlimentos(name) {
  const sql = name
    ? "SELECT * FROM food WHERE name LIKE ?"
    : "SELECT * FROM food";
  const params = name ? [`%${name}%`] : [];

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function adicionarOuAtualizarPorNome({ name, quantity, date, reference, purchase_value, expiration }) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM food WHERE name = ?", [name], (err, row) => {
      if (err) return reject(err);

      if (row) {
        const novaQuantidade = row.quantity + parseInt(quantity, 10);
        db.run(
          `UPDATE food SET quantity = ?, date = ?, reference = ?, purchase_value = ?, expiration = ? WHERE id = ?`,
          [novaQuantidade, date, reference, purchase_value, expiration, row.id],
          function (err) {
            if (err) return reject(err);
            resolve({
              id: row.id,
              name,
              quantity: novaQuantidade,
              message: "Estoque atualizado com sucesso!"
            });
          }
        );
      } else {
        db.run(
          `INSERT INTO food (name, quantity, date, reference, purchase_value, expiration)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [name, quantity, date, reference, purchase_value, expiration],
          function (err) {
            if (err) return reject(err);
            resolve({
              id: this.lastID,
              name,
              quantity,
              message: "Alimento cadastrado com sucesso!"
            });
          }
        );
      }
    });
  });
}

function atualizarPorId(id, { name, quantity, date, reference, purchase_value, expiration }) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM food WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject({ statusCode: 404, message: "Alimento não encontrado." });

      db.run(
        `UPDATE food SET name = ?, quantity = ?, date = ?, reference = ?, purchase_value = ?, expiration = ? WHERE id = ?`,
        [name, quantity, date, reference, purchase_value, expiration, id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
}

function removerPorId(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM food WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return reject({ statusCode: 404, message: "Alimento não encontrado." });
      resolve();
    });
  });
}

module.exports = {
  buscarAlimentos,
  adicionarOuAtualizarPorNome,
  atualizarPorId,
  removerPorId
};
