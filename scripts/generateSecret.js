const crypto = require('crypto');

// Gera uma chave JWT segura de 32 bytes (256 bits)
const secret = crypto.randomBytes(32).toString('base64');

console.log('🔐 JWT_SECRET gerado:');
console.log(secret);
console.log('\n📝 Adicione esta linha ao seu arquivo .env:');
console.log(`JWT_SECRET=${secret}`);