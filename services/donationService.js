const donationRepository = require('../repositories/donationRepository');
const foodRepository = require('../repositories/foodRepository');
const cache = require('../utils/cache');

async function criarDoacao({ food_id, quantity, donor_name, reference, expiration, donation_date }) {
  const dataDoacao = donation_date || new Date().toISOString().slice(0, 10);
  const validadeItem = expiration || null;
  
  const result = await donationRepository.create({
    food_id, quantity, donor_name: donor_name || 'Anônimo', reference, expiration: validadeItem, donation_date: dataDoacao
  });
  
  await foodRepository.incrementQuantity(food_id, quantity);
  
  // Invalidar cache
  cache.invalidatePattern('donation:');
  cache.invalidatePattern('dashboard:');
  
  return {
    id: result.id,
    food_id,
    quantity,
    donor_name,
    reference,
    expiration: validadeItem,
    donation_date: dataDoacao,
  };
}

async function listarDoacoes() {
  const cacheKey = 'donation:list';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await donationRepository.findAllWithFood();
  cache.set(cacheKey, result, 120000); // 2 minutos
  return result;
}

async function removerDoacao(id) {
  const row = await donationRepository.findById(id);
  if (!row) {
    const error = new Error('Doação não encontrada.');
    error.statusCode = 404;
    throw error;
  }
  
  await donationRepository.delete(id);
  
  // Invalidar cache
  cache.invalidatePattern('donation:');
  cache.invalidatePattern('dashboard:');
}

async function atualizarDoacao(id, { food_id, quantity, donor_name, reference, expiration, donation_date }) {
  const row = await donationRepository.findById(id);
  if (!row) {
    const error = new Error('Doação não encontrada.');
    error.statusCode = 404;
    throw error;
  }
  
  await donationRepository.update(id, { food_id, quantity, donor_name, reference, expiration, donation_date });
  
  // Invalidar cache
  cache.invalidatePattern('donation:');
  cache.invalidatePattern('dashboard:');
}

module.exports = {
  criarDoacao,
  listarDoacoes,
  removerDoacao,
  atualizarDoacao,
};