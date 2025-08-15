// 🟢 Inicialização
document.addEventListener("DOMContentLoaded", () => {
  fetchDonationHistory();
  document.getElementById("donationForm").addEventListener("submit", registerDonation);
  document.getElementById('logoutButton').addEventListener('click', handleLogout);
  document.getElementById("btnSearchFood").addEventListener("click", () => {
    buscarAlimento("searchFood", "searchResult", "donationFoodId", "donationExpiration");
  });
});

async function buscarAlimento(searchInputId, resultId, foodIdField, expirationField) {
  const searchTerm = document.getElementById(searchInputId).value;
  if (!searchTerm) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/food?search=${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const foods = await response.json();
    if (foods.length > 0) {
      document.getElementById(foodIdField).value = foods[0].id;
      document.getElementById(resultId).innerHTML = `<p>Alimento encontrado: ${foods[0].name}</p>`;
      if (expirationField) {
        document.getElementById(expirationField).value = foods[0].expiration || '';
      }
    } else {
      document.getElementById(resultId).innerHTML = '<p>Nenhum alimento encontrado</p>';
    }
  } catch (error) {
    console.error("Erro ao buscar alimento:", error);
    document.getElementById(resultId).innerHTML = '<p>Erro ao buscar alimento</p>';
  }
}

// ✅ Registrar doação
async function registerDonation(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const payload = {
    food_id: document.getElementById("donationFoodId").value,
    quantity: document.getElementById("donationQuantity").value,
    donor_name: document.getElementById("donorName").value,
    reference: document.getElementById("reference").value,
    donation_date: document.getElementById("donationDate").value,
    expiration: document.getElementById("donationExpiration").value
  };

  ConfirmDialog.show(
    `Confirma o registro da doação de ${payload.quantity} unidades do doador "${payload.donor_name || 'Anônimo'}"?`,
    async () => {
      LoadingManager.show(submitBtn, 'Registrando...');

      try {
        const res = await fetch("/donation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao registrar doação.");

        exibirMensagem("Doação registrada com sucesso!", "success");
        document.getElementById("donationForm").reset();
        document.getElementById("searchResult").innerHTML = "";
        fetchDonationHistory();
      } catch (error) {
        console.error("Erro ao registrar doação:", error);
        exibirMensagem("Erro: " + error.message, "danger");
      } finally {
        LoadingManager.hide(submitBtn);
      }
    }
  );
}

// 📄 Histórico de doações
async function fetchDonationHistory() {
  LoadingManager.showTable('donationTable', 'Carregando histórico de doações...');
  
  try {
    const res = await fetch("/donation", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const data = await res.json();
    const tbody = document.querySelector("#donationTable tbody");
    tbody.innerHTML = "";

    data.forEach((d) => {
      tbody.innerHTML += `
        <tr>
          <td>${d.food_name}</td>
          <td>${d.quantity}</td>
          <td>${d.donor_name || "-"}</td>
          <td>${d.donation_date || "-"}</td>
          <td>${d.expiration || "-"}</td>
        </tr>`;
    });
  } catch (error) {
    exibirMensagem("Erro ao carregar histórico de doações: " + error.message, "danger");
  }
}

async function gerarRelatorio(tipo) {
  const token = localStorage.getItem('token');
  if (!token) {
    exibirMensagem("Usuário não autenticado. Faça login novamente.", "warning");
    window.location.href = '/login';
    return;
  }

  const url = `/relatorios/donations/${tipo}`;

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
    a.download = `relatorio_doacoes.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    exibirMensagem("Erro: " + error.message, "danger");
  }
}


