const { exec } = require("child_process");

console.log("🛑 Encerrando o servidor de testes...");

const isWindows = process.platform === "win32";
const port = 3001;

const findCommand = isWindows
  ? `netstat -ano | findstr :${port}`
  : `lsof -ti :${port}`;

exec(findCommand, (err, stdout) => {
  if (err || !stdout.trim()) {
    console.log("⚠️ Nenhum servidor ativo encontrado na porta 3001.");
    process.exit(0);
  }

  const pids = stdout
    .trim()
    .split("\n")
    .map(line => {
      if (isWindows) {
        const parts = line.trim().split(/\s+/);
        return parts[parts.length - 1]; // Última coluna = PID
      }
      return line.trim(); // Unix: o PID é a própria linha
    })
    .filter(pid => pid && pid !== "0");

  if (pids.length === 0) {
    console.log("⚠️ Nenhum PID válido encontrado. Abortando encerramento.");
    process.exit(0);
  }

  const killCommand = isWindows
    ? `taskkill /F ${pids.map(pid => `/PID ${pid}`).join(" ")}`
    : `kill -9 ${pids.join(" ")}`;

  console.log(`🔫 Matando processo(s) na porta ${port}: ${pids.join(", ")}`);

  exec(killCommand, (killErr) => {
    if (killErr) {
      console.error("❌ Erro ao encerrar processo(s):", killErr.message);
      process.exit(1);
    } else {
      console.log("✅ Servidor encerrado com sucesso.");
      process.exit(0);
    }
  });
});
