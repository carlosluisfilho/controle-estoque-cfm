async function carregarPainel() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "/login";
            return;
        }

        // 🛠 Define um estado de carregamento inicial
        document.getElementById("totalAlimentos").innerText = "Carregando...";
        document.getElementById("totalDoacoes").innerText = "Carregando...";
        document.getElementById("totalDistribuicoes").innerText = "Carregando...";

        const response = await fetch("http://localhost:3001/dashboard", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar dados do painel.");
        }

        const data = await response.json();
        console.log("📊 Dados recebidos do backend:", data);

        // ✅ Atualiza os valores no HTML
        document.getElementById("totalAlimentos").innerText = data.totalAlimentos;
        document.getElementById("totalDoacoes").innerText = data.totalDoacoes;
        document.getElementById("totalDistribuicoes").innerText = data.totalDistribuicoes;

        // 🔄 Carregar estoque
        await carregarEstoque();

        // 📊 Atualizar gráfico de doações
        atualizarGrafico(data.totalDoacoes, data.totalDistribuicoes);
    } catch (error) {
        console.error("Erro ao carregar painel:", error);
        alert("Erro ao carregar o painel de controle.");
    }
}

// Chamar a função ao carregar a página
window.onload = carregarPainel;

async function carregarEstoque() {
    try {
        const response = await fetch("http://localhost:3001/inventory", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar estoque.");
        }

        const data = await response.json();

        const tableBody = document.getElementById("estoqueTableBody");
        if (!tableBody) {
            console.error("⚠️ Elemento 'estoqueTableBody' não encontrado no HTML. Verifique se o ID está correto e se o elemento foi carregado.");
            return;
        }

        tableBody.innerHTML = "";

        data.forEach(item => {
            const row = `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.lastUpdated || 'N/A'}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
    }
}

let chartInstance = null; // Variável global para armazenar a instância do gráfico

function atualizarGrafico(doacoes, distribuicoes) {
    const canvas = document.getElementById("graficoDoacoes");
    if (!canvas) {
        console.error("⚠️ Elemento 'graficoDoacoes' não encontrado no HTML. Verifique se o ID está correto e se o elemento foi carregado.");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("⚠️ O elemento 'graficoDoacoes' não suporta getContext.");
        return;
    }

    // Se já houver um gráfico, destruí-lo antes de criar um novo
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Doações", "Distribuições"],
            datasets: [{
                label: "Quantidade",
                data: [doacoes, distribuicoes],
                backgroundColor: ["#28a745", "#ffc107"],
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarPainel();
});

