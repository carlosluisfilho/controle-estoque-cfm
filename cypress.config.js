const { defineConfig } = require("cypress");

module.exports = {
  e2e: {
    baseUrl: "http://localhost:3001", // ✅ Defina a URL correta do servidor
    setupNodeEvents(on, config) {
      // implement node event listeners aqui
    }
  }
}

