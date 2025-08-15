// js/dashboard.js (refatorado com feedback visual e proteção de DOM)
document.addEventListener("DOMContentLoaded", function() {
  carregarPainel();
  document.getElementById('logoutButton').addEventListener('click', handleLogout);
});

async function carregarPainel() {
  console.log('🔍 Iniciando carregamento do painel...');
  
  // Mostrar loading nos totais
  document.getElementById('totalAlimentos').textContent = 'Carregando...';
  document.getElementById('totalDoacoes').textContent = 'Carregando...';
  document.getElementById('totalDistribuicoes').textContent = 'Carregando...';
  
  // Mostrar loading nas tabelas
  if (typeof LoadingManager !== 'undefined') {
    LoadingManager.showTable('tabelaAlimentos', 'Carregando últimos alimentos...');
    LoadingManager.showTable('tabelaDoacoes', 'Carregando últimas doações...');
    LoadingManager.showTable('tabelaDistribuicoes', 'Carregando últimas distribuições...');
  }

  try {
    const token = localStorage.getItem("token");
    console.log('🔑 Token encontrado:', !!token);
    
    if (!token) {
      redirecionarLogin("Usuário não autenticado. Faça login novamente.");
      return;
    }

    console.log('🚀 Fazendo requisição para /dashboard...');
    const response = await fetch("/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Status da resposta:', response.status);

    if (response.status === 401) {
      redirecionarLogin("Sessão expirada. Faça login novamente.");
      return;
    }

    const data = await response.json();
    console.log('📋 Dados recebidos:', data);

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
  console.log('🔄 Atualizando painel com dados:', data);
  
  document.getElementById("totalAlimentos").textContent = data.totais.alimentos || 0;
  document.getElementById("totalDoacoes").textContent = data.totais.doacoes || 0;
  document.getElementById("totalDistribuicoes").textContent = data.totais.distribuicoes || 0;
  
  console.log('✅ Totais atualizados');

  preencherTabela("tabelaAlimentos", data.ultimasMovimentacoes.alimentos, ["name", "quantity", "created_at"]);
  preencherTabela("tabelaDoacoes", data.ultimasMovimentacoes.doacoes, ["food_name", "quantity", "donor_name", "created_at"]);
  preencherTabela("tabelaDistribuicoes", data.ultimasMovimentacoes.distribuicoes, ["food_name", "quantity", "house_name", "created_at"]);
  
  console.log('✅ Tabelas preenchidas');
}

function preencherTabela(idTabela, dados, colunas) {
  if (!Array.isArray(dados)) return;

  const tabela = document.getElementById(idTabela);
  if (!tabela) return;

  const tbody = tabela.tagName.toLowerCase() === "tbody" ? tabela : tabela.querySelector("tbody");
  if (!tbody) return;

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