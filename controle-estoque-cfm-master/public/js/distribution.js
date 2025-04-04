// ✅ Logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });
  
  // ✅ Ao carregar a página
  document.addEventListener("DOMContentLoaded", function () {
    fetchDistributionHistory();
    document.getElementById("btnSearchFood").addEventListener("click", searchFood);
    document.getElementById("distributionForm").addEventListener("submit", registerDistribution);
  });
  
  // 🔍 Buscar alimento no estoque
  async function searchFood() {
    const foodName = document.getElementById("searchFood").value.trim();
    const resultElement = document.getElementById("searchResult");
  
    if (!foodName) {
      resultElement.innerHTML = '<span class="text-danger">Digite o nome do alimento.</span>';
      return;
    }
  
    try {
      const response = await fetch(`/food?name=${encodeURIComponent(foodName)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
  
      if (!response.ok) throw new Error("Erro ao buscar alimento.");
  
      const food = await response.json();
  
      if (food.length > 0) {
        document.getElementById("distributionFoodId").value = food[0].id;
        resultElement.innerHTML = `<span class="text-success">✅ ${food[0].name} encontrado! Quantidade disponível: ${food[0].quantity}</span>`;
      } else {
        resultElement.innerHTML = '<span class="text-danger">❌ Alimento não encontrado.</span>';
      }
  
    } catch (error) {
      console.error("Erro ao buscar alimento:", error);
      resultElement.innerHTML = '<span class="text-danger">Erro ao buscar alimento.</span>';
    }
  }
  
  // 🚀 Registrar distribuição
  async function registerDistribution(event) {
    event.preventDefault();
  
    const food_id = Number(document.getElementById("distributionFoodId").value);
    const quantity = Number(document.getElementById("distributionQuantity").value);
    const house_name = document.getElementById("houseName").value;
  
    if (!food_id || !quantity || !house_name) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
  
    try {
      const response = await fetch("/distribution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ food_id, quantity, house_name })
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Erro ao registrar distribuição.");
  
      alert("✅ Distribuição registrada com sucesso!");
      document.getElementById("distributionForm").reset();
      fetchDistributionHistory();
  
    } catch (error) {
      console.error("Erro ao registrar distribuição:", error);
      alert(error.message);
    }
  }
  
  // 📜 Carregar histórico de distribuições
  async function fetchDistributionHistory() {
    try {
      const response = await fetch("/distribution", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
  
      if (!response.ok) throw new Error("Erro ao carregar histórico.");
  
      const distributions = await response.json();
      const tableBody = document.querySelector("#distributionHistory tbody");
      tableBody.innerHTML = "";
  
      distributions.forEach(distribution => {
        tableBody.innerHTML += `
          <tr>
            <td>${distribution.id}</td>
            <td>${distribution.food_name}</td>
            <td>${distribution.quantity}</td>
            <td>${distribution.house_name}</td>
            <td>${new Date(distribution.created_at).toLocaleString()}</td>
          </tr>`;
      });
  
    } catch (error) {
      console.error("Erro ao carregar distribuições:", error);
    }
  }
  
  // 📄 Gerar relatório
  async function gerarRelatorio(tipo) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '/login';
      return;
    }
  
    const url = `/relatorios/distributions/${tipo}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!response.ok) throw new Error('Erro ao gerar relatório.');
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `relatorio_distribuicoes.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
  
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert(error.message);
    }
  }  