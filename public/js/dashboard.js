async function carregarPainel() {
  try {
      const token = localStorage.getItem("token"); // 🔥 Pega o token salvo no navegador

      if (!token) {
          alert("Usuário não autenticado. Faça login novamente.");
          window.location.href = "/login";
          return;
      }

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

      // ✅ Atualiza os valores no HTML
      document.getElementById("totalAlimentos").innerText = data.totalAlimentos;
      document.getElementById("totalDoacoes").innerText = data.totalDoacoes;
      document.getElementById("totalDistribuicoes").innerText = data.totalDistribuicoes;

  } catch (error) {
      console.error("Erro ao carregar painel:", error);
      alert("Erro ao carregar o painel de controle.");
  }
}

// Chamar a função ao carregar a página
window.onload = carregarPainel;
