const foodRepository = require('../repositories/foodRepository');
const cache = require('../utils/cache');

async function buscarAlimentos(name) {
  const cacheKey = `food:search:${name || 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await foodRepository.findByName(name);
  cache.set(cacheKey, result, 120000); // 2 minutos
  return result;
}

function calcularTotalEReferencia(quantity, purchase_value, date) {
  const total = parseFloat(quantity) * parseFloat(purchase_value);
  const [year, month] = date.split("-"); // formato: yyyy-MM-dd
  const month_reference = `${year}-${month}`;
  return { total, month_reference };
}

async function adicionarOuAtualizarPorNome({ name, quantity, date, reference, purchase_value, expiration }) {
  const row = await foodRepository.findByNameExact(name);
  const { total, month_reference } = calcularTotalEReferencia(quantity, purchase_value, date);

  let result;
  if (row) {
    const novaQuantidade = row.quantity + parseInt(quantity, 10);
    const novoTotal = novaQuantidade * parseFloat(purchase_value);
    
    await foodRepository.update(row.id, {
      quantity: novaQuantidade, date, reference, purchase_value, expiration, total: novoTotal, month_reference
    });
    
    result = { id: row.id, name, quantity: novaQuantidade, message: "Estoque atualizado com sucesso!" };
  } else {
    const createResult = await foodRepository.create({
      name, quantity, date, reference, purchase_value, expiration, total, month_reference
    });
    
    result = { id: createResult.id, name, quantity, message: "Alimento cadastrado com sucesso!" };
  }

  // Invalidar cache
  cache.invalidatePattern('food:');
  cache.invalidatePattern('dashboard:');
  
  return result;
}

async function atualizarPorId(id, { name, quantity, date, reference, purchase_value, expiration }) {
  const row = await foodRepository.findById(id);
  if (!row) {
    const error = new Error("Alimento não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const { total, month_reference } = calcularTotalEReferencia(quantity, purchase_value, date);
  await foodRepository.update(id, { name, quantity, date, reference, purchase_value, expiration, total, month_reference });
  
  // Invalidar cache
  cache.invalidatePattern('food:');
  cache.invalidatePattern('dashboard:');
}

async function removerPorId(id) {
  await foodRepository.delete(id);
  
  // Invalidar cache
  cache.invalidatePattern('food:');
  cache.invalidatePattern('dashboard:');
}

module.exports = {
  buscarAlimentos,
  adicionarOuAtualizarPorNome,
  atualizarPorId,
  removerPorId
};
