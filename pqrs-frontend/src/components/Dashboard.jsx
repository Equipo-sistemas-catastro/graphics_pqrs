import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Importamos el gráfico de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js para el gráfico de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:5000/api/pqrs")  // Asegúrate de que la URL es correcta
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);

  // Agrupar los datos por fecha y contar los estados
  const groupedData = data.reduce((acc, item) => {
    const date = item.date.split("T")[0]; // Tomamos solo la fecha (sin la parte de la hora)
    if (!acc[date]) {
      acc[date] = { FINALIZADO: 0, ABIERTO: 0 };
    }
    acc[date][item.value]++;
    return acc;
  }, {});

  // Convertir los datos agrupados en el formato que Chart.js puede usar
  const chartData = {
    labels: Object.keys(groupedData), // Las fechas serán las etiquetas del eje X
    datasets: [
      {
        label: 'FINALIZADO',
        data: Object.values(groupedData).map((item) => item.FINALIZADO), // Contar cuántos "FINALIZADO" hay por fecha
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras para "FINALIZADO"
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'ABIERTO',
        data: Object.values(groupedData).map((item) => item.ABIERTO), // Contar cuántos "ABIERTO" hay por fecha
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color de las barras para "ABIERTO"
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Estado por Fecha',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Estados',
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <Bar 
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default Dashboard;
