const { exec } = require("child_process");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3001;
const isWindows = process.platform === "win32";

console.log(`🚀 Iniciando servidor na porta ${PORT}...`);

function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const findCommand = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti :${port}`;

    exec(findCommand, (err, stdout) => {
      if (err || !stdout.trim()) {
        console.log(`✅ Porta ${port} está livre.`);
        resolve();
        return;
      }

      const pids = stdout
        .trim()
        .split("\n")
        .map(line => {
          if (isWindows) {
            const parts = line.trim().split(/\s+/);
            return parts[parts.length - 1];
          }
          return line.trim();
        })
        .filter(pid => pid && pid !== "0");

      if (pids.length === 0) {
        resolve();
        return;
      }

      const killCommand = isWindows
        ? `taskkill /F ${pids.map(pid => `/PID ${pid}`).join(" ")}`
        : `kill -9 ${pids.join(" ")}`;

      console.log(`🔫 Matando processo(s) na porta ${port}: ${pids.join(", ")}`);

      exec(killCommand, (killErr) => {
        if (killErr) {
          console.error("❌ Erro ao matar processo:", killErr.message);
        } else {
          console.log("✅ Processo(s) finalizado(s) com sucesso.");
        }
        resolve();
      });
    });
  });
}

async function startServer() {
  await killProcessOnPort(PORT);
  
  console.log("🚀 Iniciando aplicação...");
  
  const server = spawn("node", ["server.js"], {
    stdio: "inherit",
    env: { ...process.env, PORT }
  });

  // Capturar sinais de interrupção
  process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
    server.kill('SIGTERM');
  });

  server.on("error", (err) => {
    console.error("❌ Erro ao iniciar servidor:", err.message);
    process.exit(1);
  });

  server.on("exit", (code, signal) => {
    if (signal) {
      console.log(`🛑 Servidor encerrado por sinal ${signal}`);
    } else {
      console.log(`🛑 Servidor encerrado com código ${code}`);
    }
    process.exit(code || 0);
  });
}

startServer();