import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin de datalabels

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler, ChartDataLabels); // Registrar el plugin

const StateAtempt = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Realizar la consulta para obtener los datos de los estados
    axios.get("http://localhost:5000/api/estado-atempt")
      .then((response) => {
        console.log("Datos de la API:", response.data);
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
        backgroundColor: 'rgba(75, 28, 27, 0.6)',
        borderColor: 'rgba(75, 38, 37, 1)',
        borderWidth: 1,
        fill: false, // Si no quieres usar 'fill', esta es la opción para desactivarlo
      },
    ],
  };

  return (
    <div className="w-full h-[400px]">
      {/* Título y subtítulo como texto separado */}
      <div style={{ textAlign: "center", marginBottom: "10px", marginTop: "20px", color: 'rgba(75, 28, 27, 0.8)', fontWeight: 'bold', fontSize: '24px' }}>
        <h2 style={{ margin: 0 }}>Cantidad de Estados</h2>
        <p style={{ margin: 0, fontSize: "14px", color: 'rgba(75, 28, 27, 0.8)', fontWeight: 'bold' }}>
          Cantidad de trámites por categoría en un periodo comprendido desde 2024 hasta la fecha
        </p>
      </div>

      {/* Gráfico de barras */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Cantidad de Estados', // Título principal
              font: {
                size: 18,
              },
            },
            legend: { position: 'top' },
            // Configuración para mostrar los valores sobre las barras
            datalabels: {
              display: true, // Mostrar los datalabels
              color: 'rgba(75, 28, 27, 0.8)', // Color de los valores
              font: {
                size: 14, // Tamaño de la fuente
                weight: 'bold', // Peso de la fuente
              },
              anchor: 'end', // Colocar el texto en la parte superior de las barras
              align: 'start', // Alinear al comienzo de la barra
              offset: -28, // Desplazamiento para no estar pegado a la barra
            },
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
