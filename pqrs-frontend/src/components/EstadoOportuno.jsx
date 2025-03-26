import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrando los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const EstadoOportuno = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    mes: null,
    anio: null,
    oportunidad: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/estado-oportuno")
      .then((response) => {
        console.log("Datos de la API:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filtrando los datos
  const filteredData = data.filter((item) => {
    return (
      (filters.mes ? item.mes.toString() === filters.mes : true) &&
      (filters.anio ? item.anio === filters.anio : true) &&
      (filters.oportunidad
        ? item.oportuno.toString() === filters.oportunidad
        : true)
    );
  });

  // Extrayendo los datos para la gráfica
  const chartData = {
    labels: filteredData.map((item) => `${item.mes}-${item.anio}`),
    datasets: [
      {
        label: "Oportuno",
        data: filteredData.map((item) => item.oportuno),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "No Oportuno",
        data: filteredData.map((item) => item.no_oportuno),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "A Tiempo",
        data: filteredData.map((item) => item.a_tiempo),
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Color para A Tiempo
      },
    ],
  };

  // Configuración de la gráfica
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        color: "black",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Meses-Años",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad",
        },
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 40,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl mb-7 text-center text-blue-700 font-bold">Gráfica de Estado Oportuno <span className="text-orange-600 font-bold">/</span> No Oportuno <span className="text-orange-600 font-bold">/ </span>A Tiempo</h2>
      {/* Filtros */}
      <div className="mb-4 flex space-x-4">
        <select
          name="mes"
          value={filters.mes || ""}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Seleccionar Mes</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          name="anio"
          value={filters.anio || ""}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Seleccionar Año</option>
          {[2024, 2025].map((anio) => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>
        <select
          name="oportunidad"
          value={filters.oportunidad || ""}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Seleccionar Oportunidad</option>
          <option value="0">No Oportuno</option>
          <option value="1">Oportuno</option>
          <option value="2">A Tiempo</option> {/* Agregado para A Tiempo */}
        </select>
      </div>

      {/* Gráfica de barras */}
      <div className="w-full max-w-4xl mx-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EstadoOportuno;
