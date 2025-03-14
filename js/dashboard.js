let chartInstance; // Certifique-se de declarar a variável apenas uma vez

document.addEventListener("DOMContentLoaded", () => {
  // ...existing code...

  if (chartInstance) {
    chartInstance.destroy(); // Destroi o gráfico existente antes de criar um novo
  }

  chartInstance = new Chart(document.getElementById("graficoDoacoes"), {
    type: "bar",
    data: {
      labels: ["Janeiro", "Fevereiro", "Março"],
      datasets: [
        {
          label: "Doações",
          data: [10, 20, 30],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
});
// ...existing code...