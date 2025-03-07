async function gerarRelatorio(tipo) {
  const token = localStorage.getItem('token'); // Pegando o token salvo no navegador

  if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '/login';
      return;
  }

  let url = `/relatorios/donations/${tipo}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` } // Adicionando o token
      });

      if (!response.ok) {
          throw new Error('Erro ao gerar relatório.');
      }

      // Criar um link de download do relatório
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `relatorio_doacoes.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert(error.message);
  }
}