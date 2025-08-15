// Função global para exibir mensagens
function exibirMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem");
  if (mensagem) {
    mensagem.className = `alert alert-${tipo}`;
    mensagem.textContent = texto;
    mensagem.style.display = 'block';
    mensagem.classList.remove('d-none');
    
    setTimeout(() => {
      mensagem.style.display = 'none';
      mensagem.classList.add('d-none');
    }, 5000);
  }
}

// Função para logout
function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}