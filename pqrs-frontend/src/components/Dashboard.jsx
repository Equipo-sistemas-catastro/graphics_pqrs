import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import BarChart3D from '../components/BarChart3D';
import StateAtempt from '../components/StateAtempt';
import Tema from "./Tema";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [tramitesMes, setTramitesMes] = useState([]);
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("all");

  useEffect(() => {
    // Obtener los datos de PQRS
    axios.get("http://localhost:5000/api/pqrs")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });

    // Obtener los datos de trámites por mes
    // Obtener los datos de trámites por mes
    axios.get("http://localhost:5000/api/tramites-mes")
      .then((response) => {
        console.log("Datos Trámites por mes:", response.data);  // Verifica los datos recibidos
        setTramitesMes(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los trámites por mes", error);
      });
  }, []);

  const filterData = (data) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = itemDate.getMonth() + 1;

      const yearMatch = year === "all" || itemYear === year;
      const monthMatch = month === "all" || itemMonth === parseInt(month);

      return yearMatch && monthMatch;
    });
  };

  const groupedData = filterData(data).reduce((acc, item) => {
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

  // Verificación de tramitesMes antes de usarlo
  const tramitesMesLabels = tramitesMes.map(item => `${item.anio}-${item.mes.toString().padStart(2, '0')}`);
  const tramitesMesData = tramitesMes.map(item => item.total_tramites);

  // Filtrar valores nulos o indefinidos en tramitesMes
  const validTramitesMesData = tramitesMesData.filter(value => value != null);
  const validTramitesMesLabels = tramitesMesLabels.slice(0, validTramitesMesData.length);

  const tramitesMesChartData = {
    labels: validTramitesMesLabels,
    datasets: [
      {
        label: 'Total Trámites',
        data: validTramitesMesData,
        borderColor: 'rgba(124, 80, 124, 0.8)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-8 relative">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-all"
      >
        Cerrar Sesión
      </button>

      <h2 className="text-center text-3xl font-semibold mb-6 text-orange-600">Dashboard PQRS</h2>

      <div className="flex flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-lg font-medium">Año:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 bg-blue-200 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Todos los años</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-lg font-medium">Mes:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 bg-blue-200 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Todos los meses</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 w-full h-[450px]">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Permite que el div controle la altura
            plugins: {
              title: { display: true, text: 'Estados por Fecha' },
              legend: { position: 'top' },
              datalabels: {
                display: false, // Aseguramos que los valores estén visibles si es necesario
                color: 'blue',
                align: 'center', // Alineación de los valores en el centro de las barras
                anchor: 'end',  // Ancla el texto al principio de la barra (hacia arriba)
                // Ajustamos la posición hacia arriba con padding negativo
                offset: 20,
                padding: {
                  top: 10,  // Esto mueve los valores un poco más arriba de las barras
                },
              },
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

      <div className="mt-8 w-full h-[400px]">
        <Line
          data={tramitesMesChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: "Total Trámites por Mes y Año" },
              legend: { position: "top" },
              datalabels: {
                display: true, // Mostrar los valores
                color: "#a5158c",
                font: {
                  size: 12,
                  weight: "bold",
                },
                anchor: "center", // Centrado en el punto
                align: "bottom", // Alineación de los valores sobre los puntos
                offset: -30, // Desplazamiento hacia arriba
              },
            },
          }}
        />
      </div>


      { /* <h2 className="pt-10 text-center text-green-800 text-2xl font-bold">Gráfico 3D de PQRS por Estado</h2>
      <BarChart3D />repositories */}

      <StateAtempt />

      <Tema />
    </div>
  );
};


export default Dashboard;
