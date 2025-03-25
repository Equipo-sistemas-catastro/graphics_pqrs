// src/components/StateAtempt.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StateAtempt = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Realizar la consulta para obtener los datos de la base de datos (reemplaza con la URL adecuada)
    axios.get("http://localhost:5000/api/pqrs")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);
  
  // Filtrar y agrupar los datos de la consulta
  const groupedData = data.reduce((acc, item) => {
    const date = item.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = { FINALIZADO: 0, ABIERTO: 0 };
    }
    acc[date]["FINALIZADO"] += parseInt(item.finalizado, 10);
    acc[date]["ABIERTO"] += parseInt(item.abierto, 10);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'FINALIZADO',
        data: Object.values(groupedData).map((item) => item.FINALIZADO),
        backgroundColor: 'rgba(75, 19, 192, 0.6)',
        borderColor: 'rgba(75, 19, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'ABIERTO',
        data: Object.values(groupedData).map((item) => item.ABIERTO),
        backgroundColor: 'rgba(125, 10, 78, 0.7)',
        borderColor: 'rgba(125, 10, 78, 0.6)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-8 w-full h-[450px]">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false, // Permite que el div controle la altura
          plugins: {
            title: { display: true, text: 'Estados por Fecha' },
            legend: { position: 'top' },
          },
          layout: {
            padding: 10,
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default StateAtempt;
