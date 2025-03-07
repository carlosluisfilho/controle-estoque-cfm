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
  