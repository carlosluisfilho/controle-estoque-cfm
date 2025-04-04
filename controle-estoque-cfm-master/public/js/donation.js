 // 🚪 Logout
 document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });

  // 🟢 Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    fetchDonationHistory();
    document.getElementById("donationForm").addEventListener("submit", registerDonation);
    document.getElementById("btnSearchFood").addEventListener("click", buscarAlimento);
  });

  // 🔍 Buscar alimento
  async function buscarAlimento() {
    const foodName = document.getElementById("searchFood").value.trim();
    const result = document.getElementById("searchResult");
  
    if (!foodName) {
      result.innerHTML = '<span class="text-danger">Digite um nome para buscar.</span>';
      return;
    }
  
    try {
      const res = await fetch(`/food?name=${encodeURIComponent(foodName)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      const data = await res.json();
  
      if (Array.isArray(data) && data.length > 0) {
        document.getElementById("donationFoodId").value = data[0].id;
  
        if (data[0].expiration) {
          const expISO = new Date(data[0].expiration).toISOString().split('T')[0]; // yyyy-MM-dd
          document.getElementById("donationExpiration").value = expISO;
        } else {
          document.getElementById("donationExpiration").value = "";
        }
  
        result.innerHTML = `<span class="text-success">✅ ${data[0].name} encontrado! Quantidade disponível: ${data[0].quantity}</span>`;
      } else {
        result.innerHTML = '<span class="text-danger">❌ Item não encontrado.</span>';
      }
    } catch (error) {
      console.error("Erro ao buscar item:", error);
      result.innerHTML = '<span class="text-danger">Erro ao buscar item.</span>';
    }
  }

  // ✅ Registrar doação
  async function registerDonation(event) {
    event.preventDefault();

    const payload = {
      food_id: document.getElementById("donationFoodId").value,
      quantity: document.getElementById("donationQuantity").value,
      donor_name: document.getElementById("donorName").value,
      reference: document.getElementById("reference").value,
      donation_date: document.getElementById("donationDate").value,
      expiration: document.getElementById("donationExpiration").value
    };

    try {
      const res = await fetch('/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao registrar doação.');

      alert("✅ Doação registrada com sucesso!");
      document.getElementById("donationForm").reset();
      fetchDonationHistory();
      buscarAlimento();
    } catch (error) {
      console.error("Erro ao registrar doação:", error);
      alert(error.message);
    }
  }

  // 📋 Carregar histórico
  async function fetchDonationHistory() {
    try {
      const res = await fetch('/donation', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("❌ Resposta inválida:", data);
        return;
      }

      const tbody = document.querySelector('#donationHistory tbody');
      tbody.innerHTML = '';

      data.forEach(d => {
        tbody.innerHTML += `
          <tr>
            <td>${d.id}</td>
            <td>${d.food_name}</td>
            <td>${d.quantity}</td>
            <td>${d.reference || '-'}</td>
            <td>${d.donor_name || 'Anônimo'}</td>
            <td>${d.donation_date || '-'}</td>
            <td>${d.expiration || '-'}</td>
          </tr>`;
      });
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }

  // 📁 Gerar relatórios
  async function gerarRelatorio(tipo) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado.");
      window.location.href = "/login";
      return;
    }

    const url = `/relatorios/donations/${tipo}`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erro ao gerar relatório.");

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `relatorio_doacoes.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert(error.message);
    }
  }