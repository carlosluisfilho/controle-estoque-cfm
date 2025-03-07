const { exec } = require("child_process");

console.log("🛑 Encerrando o servidor de testes...");

const findCommand = process.platform === "win32"
    ? 'netstat -ano | findstr :3001'
    : 'lsof -t -i :3001';

exec(findCommand, (err, stdout) => {
    if (err || !stdout.trim()) {
        console.log("⚠️ Nenhum servidor ativo na porta 3001.");
        process.exit(0);
    } else {
        // Extrai corretamente o PID (última coluna no Windows)
        const lines = stdout.trim().split("\n");
        const pid = process.platform === "win32"
            ? lines[0].trim().split(/\s+/).pop()  // Última coluna contém o PID
            : lines[0].trim();

        if (!pid || pid === "0") {
            console.log("⚠️ Nenhum PID válido encontrado. Abortando encerramento.");
            process.exit(0);
        }

        console.log(`🔫 Matando processo ${pid} na porta 3001...`);

        const killCommand = process.platform === "win32"
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;

        exec(killCommand, (killErr) => {
            if (killErr) {
                console.error("❌ Erro ao encerrar o processo:", killErr);
                process.exit(1);
            } else {
                console.log("✅ Servidor encerrado com sucesso!");
                process.exit(0);
            }
        });
    }
});
