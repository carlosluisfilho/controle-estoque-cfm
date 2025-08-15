document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensagemErro = document.getElementById("mensagemErro");
  const btnEntrar = document.getElementById("btnEntrar");
  const btnTexto = document.getElementById("btnEntrarTexto");
  const btnSpinner = document.getElementById("btnSpinner");

  if (!form || !mensagemErro || !btnEntrar || !btnTexto || !btnSpinner) {
    console.error("❌ Elementos de login ausentes no DOM.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    esconderErro();
    bloquearBotao();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // amazonq-ignore-next-line
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        mostrarErro(data.error || "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      mostrarErro("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      desbloquearBotao();
    }
  });

  function mostrarErro(msg) {
    mensagemErro.textContent = msg;
    mensagemErro.classList.remove("d-none");
  }

  function esconderErro() {
    mensagemErro.textContent = "";
    mensagemErro.classList.add("d-none");
  }

  function bloquearBotao() {
    btnEntrar.disabled = true;
    btnTexto.classList.add("d-none");
    btnSpinner.classList.remove("d-none");
  }

  function desbloquearBotao() {
    btnEntrar.disabled = false;
    btnTexto.classList.remove("d-none");
    btnSpinner.classList.add("d-none");
  }
});
