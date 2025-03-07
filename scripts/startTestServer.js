const { exec } = require("child_process");

console.log("🚀 Iniciando o servidor para testes de front-end...");

const server = exec("node server.js", { env: { ...process.env, NODE_ENV: "test" } });

server.stdout.on("data", (data) => {
  console.log(data.toString());
});

server.stderr.on("data", (data) => {
  console.error(data.toString());
});

// Aguarde alguns segundos para garantir que o servidor subiu antes de iniciar os testes
setTimeout(() => {
  console.log("✅ Servidor iniciado! Iniciando testes de front-end...");
  process.exit(0);
}, 5000);
