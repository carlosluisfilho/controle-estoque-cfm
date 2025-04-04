// public/js/food.js

// ✅ Função para buscar e exibir os alimentos na tabela
async function fetchFoods() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/food", {
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
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteFood(${food.id})">Excluir</button>
            </td>
          </tr>
        `;
      });
    } catch (error) {
      console.error("Erro ao carregar alimentos:", error);
    }
  }
  
  // ✅ Ao carregar o DOM
  document.addEventListener("DOMContentLoaded", function () {
    fetchFoods();
  
    const addFoodForm = document.getElementById("addFoodForm");
    if (addFoodForm) {
      console.log("🔍 Verificando se evento de submit já existe...");
      addFoodForm.addEventListener("submit", handleAddFood);
      console.log("✅ Evento de submit adicionado com sucesso.");
    }
  });
  
  // ✅ Função para adicionar alimento
  async function handleAddFood(event) {
    event.preventDefault();
  
    const name = document.getElementById("foodName").value.trim();
    const quantity = document.getElementById("foodQuantity").value.trim();
    const date = document.getElementById("foodDate").value;
    const reference = document.getElementById("foodReference").value.trim();
    const purchase_value = document.getElementById("foodValue").value.trim();
    const expiration = document.getElementById("foodExpiration").value;
  
    if (!name || !quantity || !date || !reference || !purchase_value || !expiration) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const submitButton = document.querySelector("#addFoodForm button[type='submit']");
      submitButton.disabled = true;
  
      const response = await fetch("/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          quantity,
          date,
          reference,
          purchase_value,
          expiration,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao adicionar alimento.");
  
      alert("✅ Alimento adicionado com sucesso!");
      document.getElementById("addFoodForm").reset();
      fetchFoods();
    } catch (error) {
      console.error("❌ Erro ao adicionar alimento:", error);
      alert(error.message);
    } finally {
      document.querySelector("#addFoodForm button[type='submit']").disabled = false;
    }
  }
  
  // ✅ Função para excluir alimento
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