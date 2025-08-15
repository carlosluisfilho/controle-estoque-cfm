document.addEventListener("DOMContentLoaded", function () {
  // Verificar se LoadingManager está disponível
  if (typeof LoadingManager === 'undefined') {
    console.warn('LoadingManager não encontrado, criando fallback');
    window.LoadingManager = {
      show: () => {},
      hide: () => {},
      showTable: (id, msg) => {
        const table = document.getElementById(id);
        if (table) {
          const tbody = table.querySelector('tbody');
          if (tbody) tbody.innerHTML = `<tr><td colspan="100%">${msg}</td></tr>`;
        }
      }
    };
  }
  
  fetchFoods();
  document.getElementById("logoutButton").addEventListener("click", handleLogout);
  document.getElementById("addFoodForm").addEventListener("submit", handleAddFood);
});

async function fetchFoods() {
  LoadingManager.showTable('foodTable', 'Carregando alimentos...');
  
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado. Redirecionando para login.");
      window.location.href = "/login";
      return;
    }

    const response = await fetch("/food", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao buscar alimentos.");

    const foods = await response.json();
    const tableBody = document.querySelector("#foodTable tbody");
    tableBody.innerHTML = "";

    foods.forEach((food) => {
      tableBody.innerHTML += `
        <tr>
          <td>${food.id}</td>
          <td>${food.name}</td>
          <td>${food.quantity}</td>
          <td>${food.date || "-"}</td>
          <td>${food.reference || "-"}</td>
          <td>R$ ${parseFloat(food.purchase_value || 0).toFixed(2)}</td>
          <td>R$ ${parseFloat(food.total || 0).toFixed(2)}</td>
          <td>${food.month_reference || "-"}</td>
          <td>${food.expiration || "-"}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteFood(${food.id})">Excluir</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    exibirMensagem("Erro ao carregar alimentos: " + error.message, "danger");
  }
}

async function handleAddFood(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const payload = {
    name: document.getElementById("foodName").value,
    quantity: parseInt(document.getElementById("foodQuantity").value),
    date: document.getElementById("foodDate").value,
    reference: document.getElementById("foodReference").value,
    purchase_value: parseFloat(document.getElementById("foodValue").value),
    expiration: document.getElementById("foodExpiration").value
  };

  ConfirmDialog.show(
    `Confirma a adição do item "${payload.name}" com quantidade ${payload.quantity}?`,
    async () => {
      LoadingManager.show(submitBtn, 'Adicionando...');
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Erro ao adicionar item.");

        exibirMensagem("Item adicionado com sucesso!", "success");
        document.getElementById("addFoodForm").reset();
        fetchFoods();
      } catch (error) {
        exibirMensagem("Erro: " + error.message, "danger");
      } finally {
        LoadingManager.hide(submitBtn);
      }
    }
  );
}

async function deleteFood(id) {
  const deleteBtn = event.target;
  
  ConfirmDialog.show(
    "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
    async () => {
      LoadingManager.show(deleteBtn, 'Excluindo...');
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`/food/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao excluir o item.");

        exibirMensagem("Item excluído com sucesso!", "success");
        fetchFoods();
      } catch (error) {
        exibirMensagem("Erro ao excluir: " + error.message, "danger");
      } finally {
        LoadingManager.hide(deleteBtn);
      }
    }
  );
}

async function gerarRelatorioFoodPDF() {
  ConfirmDialog.show(
    'Deseja gerar o relatório de alimentos em PDF?',
    async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        exibirMensagem("Usuário não autenticado. Faça login novamente.", "warning");
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('/relatorios/food/pdf', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao gerar relatório.');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'relatorio_alimentos.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);

      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        exibirMensagem("Erro: " + error.message, "danger");
      }
    }
  );
}

async function gerarRelatorioFoodExcel() {
  const token = localStorage.getItem('token');
  if (!token) {
    exibirMensagem("Usuário não autenticado. Faça login novamente.", "warning");
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('/relatorios/food/excel', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Erro ao gerar relatório.');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'relatorio_alimentos.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    exibirMensagem("Erro: " + error.message, "danger");
  }
}
