import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StateAtempt = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Realizar la consulta para obtener los datos de los estados
    axios.get("http://localhost:5000/api/estado-atempt")
      .then((response) => {
        console.log("Datos de la API:", response.data)
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);

  // Preparamos los datos para la gráfica
  const chartData = {
    labels: ['Pendiente', 'Vencidos', 'A Tiempo', 'Oportuno', 'No Oportuno'],  // Etiquetas de las categorías
    datasets: [
      {
        label: 'Total trámites',
        data: [
          data.pendiente,
          data.vencidos,
          data.a_tiempo,
          data.oportuno,
          data.no_oportuno,
        ],
        backgroundColor: 'rgba(75, 28, 27, 0.7)',
        borderColor: 'rgba(75, 38, 37, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-[400px]">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Estados por Categoría' },
            legend: { position: 'top' },
          },
          layout: { padding: 10 },
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export default StateAtempt;
