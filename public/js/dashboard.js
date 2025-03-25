async function carregarPainel() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "/login";
            return;
        }

        const response = await fetch("/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("Dados recebidos do servidor:", data);

        if (response.ok) {
            document.getElementById("totalAlimentos").innerText = data.totais.alimentos || 0;
            document.getElementById("totalDoacoes").innerText = data.totais.doacoes || 0;
            document.getElementById("totalDistribuicoes").innerText = data.totais.distribuicoes || 0;

            preencherTabela("tabelaAlimentos", data.ultimasMovimentacoes.alimentos, ["name", "quantity", "created_at"]);
            preencherTabela("tabelaDoacoes", data.ultimasMovimentacoes.doacoes, ["food_id", "quantity", "donor_name", "created_at"]);
            preencherTabela("tabelaDistribuicoes", data.ultimasMovimentacoes.distribuicoes, ["food_id", "quantity", "house_name", "created_at"]);
        } else {
            console.error("Erro ao carregar painel:", data.error);
            alert(data.error);
        }
    } catch (error) {
        console.error("Erro ao carregar painel:", error);
    }
}

function preencherTabela(idTabela, dados, colunas) {
    const tabela = document.getElementById(idTabela);
    if (!tabela) {
        console.error(`Tabela com ID "${idTabela}" não encontrada.`);
        return;
    }
    const tbody = tabela.querySelector("tbody");
    tbody.innerHTML = "";

    dados.forEach((item) => {
        const linha = document.createElement("tr");
        colunas.forEach((coluna) => {
            const celula = document.createElement("td");
            celula.textContent = item[coluna] || "-";
            linha.appendChild(celula);
        });
        tbody.appendChild(linha);
    });
}

document.addEventListener("DOMContentLoaded", carregarPainel);
