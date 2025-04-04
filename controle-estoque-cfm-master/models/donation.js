// Importa a conexão com o banco de dados SQLite
const db = require('../database/db'); // Conexão com o SQLite

/**
 * Cria uma nova doação no banco de dados.
 *
 * @param {Object} doacao - O objeto de doação contendo os detalhes da doação.
 * @returns {Promise<number>} - Uma promessa que é resolvida com o ID da doação criada.
 */
async function criarDoacao(doacao) {
    return new Promise((resolve, reject) => {
        const { food_id, quantity, donor_name, donated_at, expiration_date } = doacao;
        const sql = `
            INSERT INTO donation (food_id, quantity, donor_name, donated_at, expiration_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(sql, [food_id, quantity, donor_name, donated_at, expiration_date], function(err) {
            if (err) {
                console.error("❌ Erro ao criar doação:", err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Lista todas as doações no banco de dados.
 *
 * @returns {Promise<Array>} - Uma promessa que é resolvida com a lista de doações.
 */
async function listarDoacoes() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM donation';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("❌ Erro ao listar doações:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Exclui uma doação do banco de dados.
 *
 * @param {number} id - O ID da doação a ser excluída.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando a doação é excluída.
 */
async function excluirDoacao(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM donation WHERE id = ?';
        db.run(sql, [id], function(err) {
            if (err) {
                console.error("❌ Erro ao excluir doação:", err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Exporta as funções para serem usadas em outras partes da aplicação
module.exports = { criarDoacao, listarDoacoes, excluirDoacao };