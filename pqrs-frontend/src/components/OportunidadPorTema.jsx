import { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

Highcharts.setOptions({
  accessibility: { enabled: false },
  lang: { thousandsSep: ',' }
});

const OportunidadPorTema = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/api/estadisticas-oportunidad-por-tema")
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          cantidad: parseInt(item.cantidad, 10)
        }));
        setChartData(formattedData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getChartOptions = () => {
    const temas = [...new Set(chartData.map(item => item.tema))]
      .sort((a, b) => {
        const totalA = chartData.filter(d => d.tema === a).reduce((sum, d) => sum + d.cantidad, 0);
        const totalB = chartData.filter(d => d.tema === b).reduce((sum, d) => sum + d.cantidad, 0);
        return totalB - totalA;
      });

    const tiposOportunidad = ["OPORTUNO", "A TIEMPO", "NO OPORTUNO"];

    return {
      chart: {
        type: 'bar',
        inverted: true,
        height: `${temas.length * 35 + 200}px`
      },
      title: {
        text: 'Oportunidad por Tema',
        align: 'left',
        style: { fontSize: '16px' }
      },
      xAxis: {
        categories: temas,
        labels: { style: { fontSize: '11px' } }
      },
      yAxis: {
        title: { text: 'Cantidad' },
        tickInterval: 500
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          pointWidth: 18,
          grouping: false, // DESACTIVA AGRUPAMIENTO AUTOMÁTICO
          dataLabels: {
            enabled: true,
            format: '{point.y:,.0f}',
            style: { fontSize: '10px' }
          }
        }
      },
      legend: {
        align: 'center',      // Centra la leyenda horizontalmente
        verticalAlign: 'top', // La coloca en la parte superior
        layout: 'horizontal', // Asegura que los elementos se alineen en una fila
        itemStyle: { fontSize: '12px' },
        margin: 20,           // Agrega un poco de espacio entre la leyenda y el gráfico
        y: 5,
        padding: 10
      },
      series: tiposOportunidad.map(oportunidad => ({
        name: oportunidad,
        color: oportunidad === "OPORTUNO" ? "#4CAF50" :
               oportunidad === "NO OPORTUNO" ? "#F44336" : "#FFC107",
        data: temas.map(tema => 
          chartData.find(d => d.tema === tema && d.oportunidad === oportunidad)?.cantidad || 0
        )
      })),
      tooltip: {
        headerFormat: '<span style="font-size:12px"><b>{series.name}</b></span><br/>',
        pointFormat: '<span style="font-size:12px">Tema: <b>{point.category}</b><br/>Cantidad: <b>{point.y:,.0f}</b></span>',
        useHTML: true
      }
    };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${chartData.length * 15}px` }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions()}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OportunidadPorTema;