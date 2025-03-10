// Importa a conexão com o banco de dados SQLite
const db = require('../database/db'); // Conexão com o SQLite

/**
 * Cria um novo alimento no banco de dados.
 * 
 * @param {Object} alimento - O objeto de alimento contendo os detalhes do alimento.
 * @returns {Promise<number>} - Uma promessa que é resolvida com o ID do alimento criado.
 */
async function criarAlimento(alimento) {
    return new Promise((resolve, reject) => {
        const { name, quantity } = alimento;
        const sql = `
            INSERT INTO food (name, quantity)
            VALUES (?, ?)
        `;
        db.run(sql, [name, quantity], function(err) {
            if (err) {
                console.error("❌ Erro ao criar alimento:", err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Lista todos os alimentos no banco de dados.
 * 
 * @returns {Promise<Array>} - Uma promessa que é resolvida com a lista de alimentos.
 */
async function listarAlimentos() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM food';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("❌ Erro ao listar alimentos:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Atualiza um alimento no banco de dados.
 * 
 * @param {number} id - O ID do alimento a ser atualizado.
 * @param {Object} alimento - O objeto de alimento contendo os novos detalhes do alimento.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o alimento é atualizado.
 */
async function atualizarAlimento(id, alimento) {
    return new Promise((resolve, reject) => {
        const { name, quantity } = alimento;
        const sql = `
            UPDATE food
            SET name = ?, quantity = ?
            WHERE id = ?
        `;
        db.run(sql, [name, quantity, id], function(err) {
            if (err) {
                console.error("❌ Erro ao atualizar alimento:", err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Exclui um alimento do banco de dados.
 * 
 * @param {number} id - O ID do alimento a ser excluído.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando o alimento é excluído.
 */
async function excluirAlimento(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM food WHERE id = ?';
        db.run(sql, [id], function(err) {
            if (err) {
                console.error("❌ Erro ao excluir alimento:", err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Exporta as funções para serem usadas em outras partes da aplicação
module.exports = { criarAlimento, listarAlimentos, atualizarAlimento, excluirAlimento };