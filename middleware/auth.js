// Importa o módulo jsonwebtoken para verificar o token JWT
const jwt = require('jsonwebtoken');

// Usa uma variável de ambiente para a chave secreta, com um valor padrão 'secreta'
const secretKey = process.env.JWT_SECRET || 'secreta';

/**
 * Middleware para autenticar o token JWT.
 * 
 * @param {Object} req - O objeto de solicitação HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - A função de callback para passar o controle para o próximo middleware.
 */
function autenticarToken(req, res, next) {
    // Obtém o token do cabeçalho 'Authorization'
    const token = req.header('Authorization');

    // Verifica se o token está presente
    if (!token) {
        console.log('Acesso negado: Token não fornecido');
        return res.status(401).json({ error: 'Acesso negado' });
    }

    // Verifica a validade do token
    jwt.verify(token.replace('Bearer ', ''), secretKey, (err, user) => {
        if (err) {
            console.log('Token inválido:', err.message);
            return res.status(403).json({ error: 'Token inválido' });
        }
        // Adiciona o usuário à solicitação e passa o controle para o próximo middleware
        req.user = user;
        next();
    });
}

// Exporta a função autenticarToken para ser usada em outras partes da aplicação
module.exports = autenticarToken;