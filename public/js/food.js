document.addEventListener("DOMContentLoaded", function () {
    fetchFoods(); // Carrega os alimentos ao iniciar a página

    const addFoodForm = document.getElementById("addFoodForm");

    if (addFoodForm) {
        console.log("🔍 Verificando se evento de submit já existe...");
        addFoodForm.addEventListener("submit", handleAddFood);
        console.log("✅ Evento de submit adicionado com sucesso.");
    }
});

// Função para adicionar alimento
async function handleAddFood(event) {
    event.preventDefault(); // 🔥 Impede o comportamento padrão do formulário

    console.log("🚀 handleAddFood chamado!");

    const name = document.getElementById("foodName").value.trim();
    const quantity = document.getElementById("foodQuantity").value.trim();

    if (!name || !quantity) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Desativa o botão para evitar duplo clique
        const submitButton = document.querySelector("#addFoodForm button[type='submit']");
        submitButton.disabled = true;

        console.log("📡 Enviando requisição para adicionar alimento...");

        const response = await fetch("/food", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name, quantity }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao adicionar alimento.");
        }

        console.log("✅ Alimento cadastrado com sucesso no servidor!");

        alert("✅ Alimento adicionado com sucesso!");
        document.getElementById("addFoodForm").reset();
        fetchFoods(); // Atualiza a tabela

    } catch (error) {
        console.error("❌ Erro ao adicionar alimento:", error);
        alert(error.message);
    } finally {
        // Reabilita o botão após a requisição ser concluída
        document.querySelector("#addFoodForm button[type='submit']").disabled = false;
    }
}
