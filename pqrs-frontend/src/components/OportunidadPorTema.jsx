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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

const OportunidadPorTema = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/estadisticas-oportunidad-por-tema")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  const procesarDatos = () => {
    const temas = [...new Set(data.map((item) => item.tema))];
    const oportunidades = ["OPORTUNO", "NO OPORTUNO", "A TIEMPO"];

    return {
      labels: temas,
      datasets: oportunidades.map((oportunidad) => ({
        label: oportunidad,
        data: temas.map((tema) => {
          const item = data.find((d) => d.tema === tema && d.oportunidad === oportunidad);
          return item ? item.cantidad : 0;
        }),
        backgroundColor:
          oportunidad === "OPORTUNO"
            ? "rgba(75, 192, 192, 0.7)"
            : oportunidad === "NO OPORTUNO"
            ? "rgba(255, 99, 132, 0.7)"
            : "rgba(255, 159, 64, 0.7)",
        borderWidth: 1,
      })),
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        anchor: 'end',
        align: 'end',  // Cambiado a 'end' para mejor posicionamiento
        offset: 5,
        color: '#1f2937',
        font: {
          weight: 'bold',
          size: 11,
        },
        formatter: (value) => value > 0 ? value : '',
        clip: false,
        display: (context) => context.dataset.data[context.dataIndex] > 0,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: data.length > 0 
          ? Math.max(...data.map(item => Number(item.cantidad || 0))) * 1.3 
          : 10,
        ticks: {
          stepSize: 1,  // Asegura números enteros en el eje Y
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[33rem] mt-5">
      <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 mt-3">
        Oportunidad por Tema
      </h2>
      <div className="h-[36rem]">
        <Bar 
          data={procesarDatos()} 
          options={options}
        />
      </div>
    </div>
  );
};

export default OportunidadPorTema;