const distributionRepository = require('../repositories/distributionRepository');
const foodRepository = require('../repositories/foodRepository');
const { dbRun } = require('../utils/dbUtils');
const cache = require('../utils/cache');

async function criarDistribuicao({ food_id, quantity, house_name }) {
  const createdAt = new Date().toISOString();
  
  const result = await distributionRepository.create({
    food_id, quantity, house_name, created_at: createdAt
  });
  
  await dbRun('UPDATE food SET quantity = quantity - ? WHERE id = ?', [quantity, food_id]);
  
  // Invalidar cache
  cache.invalidatePattern('distribution:');
  cache.invalidatePattern('dashboard:');
  
  return {
    id: result.id,
    food_id,
    quantity,
    house_name,
    created_at: createdAt,
  };
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
