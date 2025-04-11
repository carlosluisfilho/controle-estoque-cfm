// js/dashboard.js (refatorado com feedback visual)
document.addEventListener("DOMContentLoaded", carregarPainel);

async function carregarPainel() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      redirecionarLogin("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const response = await fetch("/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      redirecionarLogin("Sessão expirada. Faça login novamente.");
      return;
    }

    const data = await response.json();

    if (response.ok) {
      atualizarPainel(data);
    } else {
      exibirErro(data.error || "Erro ao carregar o painel.");
    }
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
    exibirErro("Erro inesperado ao carregar o painel.");
  }
}

function atualizarPainel(data) {
  document.getElementById("totalAlimentos").innerText = data.totais.alimentos || 0;
  document.getElementById("totalDoacoes").innerText = data.totais.doacoes || 0;
  document.getElementById("totalDistribuicoes").innerText = data.totais.distribuicoes || 0;

  preencherTabela("tabelaAlimentos", data.ultimasMovimentacoes.alimentos, ["name", "quantity", "created_at"]);
  preencherTabela("tabelaDoacoes", data.ultimasMovimentacoes.doacoes, ["food_name", "quantity", "donor_name", "created_at"]);
  preencherTabela("tabelaDistribuicoes", data.ultimasMovimentacoes.distribuicoes, ["food_name", "quantity", "house_name", "created_at"]);
}

function preencherTabela(idTabela, dados, colunas) {
  const tabela = document.getElementById(idTabela);
  if (!tabela) return;

  const tbody = tabela.querySelector("tbody");
  tbody.innerHTML = "";

  dados.forEach((item) => {
    const linha = document.createElement("tr");
    colunas.forEach((coluna) => {
      const celula = document.createElement("td");
      celula.textContent = coluna === "created_at" && item[coluna]
        ? new Date(item[coluna]).toLocaleString()
        : item[coluna] || "-";
      linha.appendChild(celula);
    });
    tbody.appendChild(linha);
  });
}

function redirecionarLogin(mensagem) {
  alert(mensagem);
  localStorage.removeItem("token");
  window.location.href = "/login";
}

function exibirErro(mensagem) {
  const alerta = document.getElementById("errorMessage");
  if (alerta) {
    alerta.classList.remove("d-none");
    alerta.textContent = mensagem;
  } else {
    alert(mensagem);
  }
}