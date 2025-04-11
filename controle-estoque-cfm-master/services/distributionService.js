// services/distributionService.js
const db = require("../database/db");

async function criarDistribuicao({ food_id, quantity, house_name }) {
  const createdAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const insertSql = `
        INSERT INTO distribution (food_id, quantity, house_name, created_at)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insertSql, [food_id, quantity, house_name, createdAt], function (err) {
        if (err) {
          db.run("ROLLBACK");
          return reject(err);
        }

        db.run(
          "UPDATE food SET quantity = quantity - ? WHERE id = ?",
          [quantity, food_id],
          function (updateErr) {
            if (updateErr) {
              db.run("ROLLBACK");
              return reject(updateErr);
            }

            db.run("COMMIT");
            resolve({
              id: this.lastID,
              food_id,
              quantity,
              house_name,
              created_at: createdAt,
            });
          }
        );
      });
    });
  });
}

async function listarDistribuicoes() {
  const sql = `
    SELECT 
      distribution.id,
      food.name AS food_name,
      distribution.quantity,
      distribution.house_name,
      distribution."created_at"
    FROM distribution
    JOIN food ON distribution.food_id = food.id
    ORDER BY distribution."created_at" DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function atualizarDistribuicao(id, { food_id, quantity, house_name }) {
  const sql = `
    UPDATE distribution
    SET food_id = ?, quantity = ?, house_name = ?
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [food_id, quantity, house_name, id], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) {
        return reject({ statusCode: 404, message: "Distribuição não encontrada." });
      }
      resolve();
    });
  });
}

async function removerDistribuicao(id) {
  const sql = `DELETE FROM distribution WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) {
        return reject({ statusCode: 404, message: "Distribuição não encontrada." });
      }
      resolve();
    });
  });
}

module.exports = {
  criarDistribuicao,
  listarDistribuicoes,
  atualizarDistribuicao,
  removerDistribuicao,
};
