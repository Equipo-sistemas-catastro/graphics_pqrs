import { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

Highcharts.setOptions({
  accessibility: { enabled: false }
});

const ClaseSolicitud_Solicitante = () => {
  const [solicitantesData, setSolicitantesData] = useState([]);
  const [clasesData, setClasesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/solicitantes-clases");
        
        // Validación exhaustiva de datos
        if (!response.data || !response.data.solicitantes || !response.data.clases) {
          throw new Error('Formato de datos incorrecto');
        }

        setSolicitantesData(response.data.solicitantes);
        setClasesData(response.data.clases);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para generar opciones de gráfico
  const getChartOptions = (title, data, color) => ({
    chart: {
      type: 'column',
      height: 500
    },
    title: { text: title },
    xAxis: {
      categories: data.map(item => item.nombre),
      title: { text: title },
      labels: {
        rotation: -45,
        style: { fontSize: '11px' }
      }
    },
    yAxis: {
      title: { text: 'Cantidad' },
      allowDecimals: false
    },
    series: [{
      name: 'Cantidad',
      data: data.map(item => item.cantidad),
      color: color,
      dataLabels: {
        enabled: true,
        format: '{point.y}'
      }
    }],
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.category}: <b>{point.y}</b>'
    },
    credits: { enabled: false }
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Distribución de PQRS</h2>
      
      {isLoading ? (
        <div className="text-center py-10">Cargando datos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfica de Solicitantes */}
          <div className="border rounded p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions(
                'Solicitantes',
                solicitantesData.map(item => ({
                  nombre: item.solicitante || 'Sin nombre',
                  cantidad: Number(item.cantidad) || 0
                })),
                '#4CAF50'
              )}
            />
          </div>

          {/* Gráfica de Clases */}
          <div className="border rounded p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions(
                'Clases de Solicitud',
                clasesData.map(item => ({
                  nombre: item.clase || 'Sin clase',
                  cantidad: Number(item.cantidad) || 0
                })),
                '#2196F3'
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaseSolicitud_Solicitante;