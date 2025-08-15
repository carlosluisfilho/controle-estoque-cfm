const distributionRepository = require('../repositories/distributionRepository');
const foodRepository = require('../repositories/foodRepository');
const { dbRun, dbGet } = require('../utils/dbUtils');
const cache = require('../utils/cache');
const db = require('../database/db');

async function criarDistribuicao({ food_id, quantity, house_name }) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      // Verificar se o alimento existe e tem estoque suficiente
      db.get('SELECT id, name, quantity FROM food WHERE id = ?', [food_id], (err, food) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }
        
        if (!food) {
          db.run('ROLLBACK');
          const error = new Error('Alimento não encontrado.');
          error.statusCode = 404;
          return reject(error);
        }
        
        if (food.quantity < quantity) {
          db.run('ROLLBACK');
          const error = new Error(`Estoque insuficiente. Disponível: ${food.quantity}, Solicitado: ${quantity}`);
          error.statusCode = 400;
          return reject(error);
        }
        
        const createdAt = new Date().toISOString();
        
        // Criar a distribuição
        db.run(
          'INSERT INTO distribution (food_id, quantity, house_name, created_at) VALUES (?, ?, ?, ?)',
          [food_id, quantity, house_name, createdAt],
          function(err) {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
            
            const distributionId = this.lastID;
            
            // Atualizar o estoque
            db.run(
              'UPDATE food SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
              [quantity, food_id, quantity],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return reject(err);
                }
                
                if (this.changes === 0) {
                  db.run('ROLLBACK');
                  const error = new Error('Falha ao atualizar estoque. Verifique se há quantidade suficiente.');
                  error.statusCode = 400;
                  return reject(error);
                }
                
                // amazonq-ignore-next-line
                db.run('COMMIT', (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return reject(err);
                  }
                  
                  // Invalidar cache
                  cache.invalidatePattern('distribution:');
                  cache.invalidatePattern('dashboard:');
                  cache.invalidatePattern('food:');
                  
                  resolve({
                    id: distributionId,
                    food_id,
                    quantity,
                    house_name,
                    created_at: createdAt,
                  });
                });
              }
            );
          }
        );
      });
    });
  });
}

async function listarDistribuicoes() {
  const cacheKey = 'distribution:list';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { dbQuery } = require('../utils/dbUtils');
  const result = await dbQuery(`
    SELECT distribution.id, food.name AS food_name, distribution.quantity,
           distribution.house_name, distribution.created_at
    FROM distribution JOIN food ON distribution.food_id = food.id
    ORDER BY distribution.created_at DESC
  `);
  
  cache.set(cacheKey, result, 120000); // 2 minutos
  return result;
}

async function atualizarDistribuicao(id, { food_id, quantity, house_name }) {
  const existing = await distributionRepository.findById(id);
  if (!existing) {
    const error = new Error('Distribuição não encontrada.');
    error.statusCode = 404;
    throw error;
  }
  await distributionRepository.update(id, { food_id, quantity, house_name });
  
  // Invalidar cache
  cache.invalidatePattern('distribution:');
  cache.invalidatePattern('dashboard:');
}

async function removerDistribuicao(id) {
  await distributionRepository.delete(id);
  
  // Invalidar cache
  cache.invalidatePattern('distribution:');
  cache.invalidatePattern('dashboard:');
}

module.exports = {
  criarDistribuicao,
  listarDistribuicoes,
  atualizarDistribuicao,
  removerDistribuicao,
};
