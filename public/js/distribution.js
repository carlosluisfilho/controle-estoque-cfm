// ✅ Inicialização
document.addEventListener("DOMContentLoaded", function () {
  fetchDistributionHistory();
  document.getElementById('logoutButton').addEventListener('click', handleLogout);
  document.getElementById("btnSearchFood").addEventListener("click", () => {
    buscarAlimento("searchFood", "searchResult", "distributionFoodId");
  });
  document.getElementById("distributionForm").addEventListener("submit", registerDistribution);
});

async function buscarAlimento(searchInputId, resultId, foodIdField) {
  const searchTerm = document.getElementById(searchInputId).value;
  if (!searchTerm) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/food?name=${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const foods = await response.json();
    if (foods.length > 0) {
      const food = foods[0];
      const distributionQuantityField = document.getElementById("distributionQuantity");
      
      document.getElementById(foodIdField).value = food.id;
      document.getElementById("stockQuantity").value = food.quantity;
      distributionQuantityField.value = '';
      distributionQuantityField.setAttribute('max', food.quantity);
      document.getElementById(resultId).innerHTML = `<p class="text-success">Alimento encontrado: <strong>${food.name}</strong> (Estoque: ${food.quantity})</p>`;
    } else {
      document.getElementById(resultId).innerHTML = '<p class="text-warning">Nenhum alimento encontrado</p>';
      document.getElementById(foodIdField).value = '';
      document.getElementById("stockQuantity").value = '';
      document.getElementById("distributionQuantity").value = '';
      document.getElementById("distributionQuantity").removeAttribute('max');
    }
  } catch (error) {
    console.error("Erro ao buscar alimento:", error);
    document.getElementById(resultId).innerHTML = '<p class="text-danger">Erro ao buscar alimento</p>';
  }
}

// 🚀 Registrar distribuição
async function registerDistribution(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const food_id = Number(document.getElementById("distributionFoodId").value);
  const quantity = Number(document.getElementById("distributionQuantity").value);
  const house_name = document.getElementById("houseName").value;
  const availableStock = Number(document.getElementById("stockQuantity").value);

  if (!food_id || !quantity || !house_name) {
    exibirMensagem("Preencha todos os campos corretamente.", "warning");
    return;
  }

  // Verificar se a quantidade não excede o estoque
  if (quantity > availableStock) {
    exibirMensagem(`Quantidade solicitada (${quantity}) excede o estoque disponível (${availableStock}).`, "warning");
    return;
  }

  ConfirmDialog.show(
    `Confirma a distribuição de ${quantity} unidades para "${house_name}"?`,
    async () => {
      LoadingManager.show(submitBtn, 'Registrando...');

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

        exibirMensagem("✅ Distribuição registrada com sucesso!", "success");
        document.getElementById("distributionForm").reset();
        fetchDistributionHistory();
        document.getElementById("searchResult").innerHTML = "";
        document.getElementById("stockQuantity").value = "";

      } catch (error) {
        console.error("Erro ao registrar distribuição:", error);
        exibirMensagem("Erro: " + error.message, "danger");
      } finally {
        LoadingManager.hide(submitBtn);
      }
    }
  );
}

// 📜 Carregar histórico
async function fetchDistributionHistory() {
  LoadingManager.showTable('distributionTable', 'Carregando histórico de distribuições...');
  
  try {
    const response = await fetch("/distribution", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) throw new Error("Erro ao carregar histórico.");

    const distributions = await response.json();
    const tableBody = document.querySelector("#distributionTable tbody");
    tableBody.innerHTML = "";

    distributions.forEach(distribution => {
      tableBody.innerHTML += `
        <tr>
          <td>${distribution.food_name}</td>
          <td>${distribution.quantity}</td>
          <td>${distribution.house_name}</td>
          <td>${new Date(distribution.created_at).toLocaleString()}</td>
        </tr>`;
    });

  } catch (error) {
    exibirMensagem("Erro ao carregar distribuições: " + error.message, "danger");
  }
}

// 📄 Gerar relatório
async function gerarRelatorio(tipo) {
  const token = localStorage.getItem('token');
  if (!token) {
    exibirMensagem("Usuário não autenticado. Faça login novamente.", "warning");
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
    exibirMensagem("Erro: " + error.message, "danger");
  }
}


