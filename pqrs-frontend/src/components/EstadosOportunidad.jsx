import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrando los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EstadosPqrsOportunidad = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/estados-oportunidad-pqrs")
      .then((response) => {
        console.log("Datos de la API:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos", error);
      });
  }, []);

  // Función para procesar los datos y agruparlos por mes, año, estado y oportunidad
  const procesarDatos = (estado) => {
    const datosFiltrados = data.filter((item) => item.estado === estado);

    const mesesAnios = Array.from(new Set(datosFiltrados.map((item) => `${item.mes}-${item.anio}`)));

    const oportunidades = ["OPORTUNO", "NO OPORTUNO", "A TIEMPO"];

    const conteos = mesesAnios.map((mesAnio) => {
      const oportunidadCounts = oportunidades.map((oportunidad) =>
        datosFiltrados
          .filter(
            (item) =>
              item.oportunidad === oportunidad && `${item.mes}-${item.anio}` === mesAnio
          )
          .reduce((acc, curr) => acc + parseInt(curr.total), 0)
      );
      return {
        mesAnio,
        oportunidadCounts,
      };
    });

    // Generamos los datos para la gráfica
    return {
      labels: mesesAnios, // Usamos meses y años como etiquetas del eje X
      datasets: oportunidades.map((oportunidad, index) => ({
        label: oportunidad,
        data: conteos.map((count) => count.oportunidadCounts[index]),
        borderColor: [
          "rgba(75, 192, 192, 1)", // OPORTUNO
          "rgba(255, 99, 132, 1)", // NO OPORTUNO
          "rgba(255, 159, 64, 1)", // A TIEMPO
        ][index],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", // OPORTUNO
          "rgba(255, 99, 132, 0.2)", // NO OPORTUNO
          "rgba(255, 159, 64, 0.2)", // A TIEMPO
        ][index],
        tension: 0.4, // Para hacer la línea más suave
      })),
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes-Año",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl mb-7 text-center text-blue-700">
        Gráficas de Estado y Oportunidad
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gráficas distribuidas en dos columnas */}
        <div className="p-4">
          <h3 className="text-xl text-center mb-4">Estado Finalizado</h3>
          <Line data={procesarDatos("FINALIZADO")} options={options} />
        </div>
        <div className="p-4">
          <h3 className="text-xl text-center mb-4">Estado Abierto</h3>
          <Line data={procesarDatos("ABIERTO")} options={options} />
        </div>
      </div>
    </div>
  );
};

export default EstadosPqrsOportunidad;
