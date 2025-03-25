import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importamos el plugin

// Registrar el plugin de datalabels
ChartJS.register(...registerables, ChartDataLabels);

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
              backgroundColor: "rgba(138, 12, 132, 0.5)", // Fondo semitransparente
              borderColor: "rgba(138, 12, 132, 0.8)", // Color de línea
              borderWidth: 2,
              fill: true, // Rellena el área bajo la línea
              tension: 0.4, // Suaviza la curva
            },
          ],
        });
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  return (
    <div className="w-full pt-7 mt-15 min-h-screen"> {/* Fondo de toda la página y altura mínima */}
      <h2 className="text-2xl font-bold mb-2 mt-20 text-center text-blue-800">PQRS <span className="text-orange-600">/</span> Tema Trámite</h2>
      <p className="mb-4 text-center text-blue-700">Cantidad de solicitudes de acuerdo al tema de consulta por parte del usuario</p>

      {data ? (
        <div className="relative w-full h-[500px] mb-10"> {/* Añadir un margen hacia abajo para separar las gráficas */}
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  display: true, // Habilitamos los datalabels
                  align: 'top',  // Alineamos las etiquetas por encima
                  color: '#007074', // Cambia el color a rojo (puedes elegir otro color)
                  font: {
                    weight: "bold", // Hacemos el texto en negrita
                    size: 12, // Tamaño de la fuente
                  },
                  offset: 14,
                },
              },
              elements: {
                line: {
                  backgroundColor: "rgba(138, 12, 132, 0.5)", // Fondo semitransparente de la línea
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: maxValue,
                  ticks: {
                    stepSize: Math.ceil(maxValue / 5),
                  },
                },
                x: {
                  grid: {
                    color: "#e2e8f0", // Color de las líneas del eje X
                  },
                },
              },
              layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 20,
                  bottom: 20,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default Tema;
