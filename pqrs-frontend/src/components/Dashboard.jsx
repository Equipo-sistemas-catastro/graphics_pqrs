import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/pqrs")
      .then((response) => {
        console.log("Datos recibidos: ", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token de sesión
    window.location.href = "/"; // Redirigir al login
  };

  // Filtrar datos por año y mes
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

  // Agrupar los datos por fecha y contar los estados
  const groupedData = filterData(data).reduce((acc, item) => {
    const date = item.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = { FINALIZADO: 0, ABIERTO: 0 };
    }
    acc[date]["FINALIZADO"] += parseInt(item.finalizado, 10);
    acc[date]["ABIERTO"] += parseInt(item.abierto, 10);
    return acc;
  }, {});

  // Configuración de datos para el gráfico
  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'FINALIZADO',
        data: Object.values(groupedData).map((item) => item.FINALIZADO),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'ABIERTO',
        data: Object.values(groupedData).map((item) => item.ABIERTO),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

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
  };

  return (
    <div className="p-8 relative">
      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-all"
      >
        Cerrar Sesión
      </button>

      <h2 className="text-center text-3xl font-semibold mb-6 text-orange-600">Dashboard</h2>

      {/* Filtros de Año y Mes */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-lg font-medium">Año:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos los meses</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mt-8">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
