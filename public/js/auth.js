// Adiciona o token nas requisições AJAX
function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login'; // Redireciona para login se o token estiver ausente
      return;
    }
  
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    return fetch(url, options);
  }

// Função de logout
function handleLogout() {
  if (typeof ConfirmDialog !== 'undefined') {
    ConfirmDialog.show(
      'Tem certeza que deseja sair do sistema?',
      () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    );
  } else {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
}
  