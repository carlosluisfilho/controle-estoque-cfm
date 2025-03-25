document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        document.getElementById('mensagemErro').textContent = data.error || 'Falha ao fazer login.';
        document.getElementById('mensagemErro').classList.remove('d-none');
        return;
      }
  
      localStorage.setItem('token', data.token);
      window.location.href = '/painel'; // Redireciona para o painel após login
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      alert('Erro ao conectar com o servidor.');
    }
  });
  