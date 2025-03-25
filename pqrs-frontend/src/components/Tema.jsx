import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importamos el plugin

const Tema = () => {
  const [data, setData] = useState(null);
  const [maxValue, setMaxValue] = useState(10); // Valor inicial para la escala

  useEffect(() => {
    fetch("http://localhost:5000/api/pqrs-tema")
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.tema);
        const values = data.map((item) => item.total);

        // Determinar el valor máximo de la escala
        const maxVal = Math.max(...values);
        setMaxValue(maxVal + Math.ceil(maxVal * 0.2)); // Se le suma un 20% para evitar que las líneas toquen el techo

        setData({
          labels,
          datasets: [
            {
              label: "Total de PQRS por Tema",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.2)", // Fondo semitransparente
              borderColor: "rgba(54, 162, 235, 1)", // Color de línea
              borderWidth: 2,
              fill: true, // Rellena el área bajo la línea
              tension: 0.4, // Suaviza la curva
              datalabels: {
                align: "top", // Alineamos las etiquetas arriba
                color: "rgba(54, 162, 235, 1)", // Color de las etiquetas
                font: {
                  weight: "bold", // Hacemos el texto negrita
                },
                formatter: (value) => value, // Mostramos el valor tal cual
              },
            },
          ],
        });
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  return (
    <div className="w-full h-[500px] pt-10">
      <h2 className="text-2xl font-bold mb-4 mt-20 text-center text-orange-500">PQRS por Tema</h2>
      {data ? (
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                display: true, // Habilitamos los datalabels
                align: 'top',  // Alineamos las etiquetas por encima
                offset: 14
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: maxValue,
                ticks: {
                  stepSize: Math.ceil(maxValue / 5),
                },
              },
            },
          }}
        />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default Tema;
