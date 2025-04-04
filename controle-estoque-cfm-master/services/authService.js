function authenticateUser(username, password) {
    if (username === 'admin' && password === '123456') {
        return { status: 'success', message: 'Autenticado com sucesso' };
    } else {
        return { status: 'error', message: 'Credenciais Invalidas' };
    }
}

module.exports = { authenticateUser };