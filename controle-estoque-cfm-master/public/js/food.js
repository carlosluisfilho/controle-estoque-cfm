// public/js/food.js

// ✅ Logout
function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", function () {
  fetchFoods();
  document.getElementById("logoutButton").addEventListener("click", handleLogout);
  document.getElementById("addFoodForm").addEventListener("submit", handleAddFood);
});

// ✅ Buscar e exibir alimentos
async function fetchFoods() {
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
          <td>${food.expiration || "-"}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteFood(${food.id})">Excluir</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error("Erro ao carregar alimentos:", error);
  }
}

// ✅ Adicionar novo alimento
async function handleAddFood(event) {
  event.preventDefault();

  const name = document.getElementById("foodName").value;
  const quantity = document.getElementById("foodQuantity").value;
  const date = document.getElementById("foodDate").value;
  const reference = document.getElementById("foodReference").value;
  const purchase_value = document.getElementById("foodValue").value;
  const expiration = document.getElementById("foodExpiration").value;
  const token = localStorage.getItem("token");

  if (!name || !quantity || !date || !reference || !purchase_value || !expiration) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, quantity, date, reference, purchase_value, expiration }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar alimento.");

    alert("✅ Alimento adicionado com sucesso!");
    document.getElementById("addFoodForm").reset();
    fetchFoods();
  } catch (error) {
    console.error("Erro ao adicionar alimento:", error);
    alert(error.message);
  }
}

// ✅ Excluir alimento
async function deleteFood(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/food/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao excluir alimento.");

    alert("Alimento removido com sucesso!");
    fetchFoods();
  } catch (error) {
    console.error("Erro ao excluir alimento:", error);
    alert(error.message);
  }
}

// ✅ Relatórios
function gerarRelatorioFoodPDF() {
  gerarRelatorio("pdf");
}

function gerarRelatorioFoodExcel() {
  gerarRelatorio("excel");
}

async function gerarRelatorio(tipo) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado. Faça login novamente.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`/relatorios/food/${tipo}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao gerar relatório.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_alimentos.${tipo === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    alert(error.message);
  }
}