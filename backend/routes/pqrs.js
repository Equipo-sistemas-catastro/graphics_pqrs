const express = require('express');
const router = express.Router();
const client = require('../db');

// Ruta para obtener los datos de PQRS (fecha_de_ingreso y estado)
router.get('/pqrs', async (req, res) => {
  try {
    const query = `
      SELECT fecha_de_ingreso, 
             COUNT(CASE WHEN estado = 'FINALIZADO' THEN 1 END) AS finalizado,
             COUNT(CASE WHEN estado = 'ABIERTO' THEN 1 END) AS abierto
      FROM pqrs_data_2024_2025
      GROUP BY fecha_de_ingreso
      ORDER BY fecha_de_ingreso;
    `;
    
    const result = await client.query(query);

    // Mapeamos los resultados para enviarlos en el formato adecuado
    const data = result.rows.map(row => ({
      date: row.fecha_de_ingreso,
      finalizado: row.finalizado || 0,  // Aseguramos que si no hay registros para un estado, se muestre 0
      abierto: row.abierto || 0
    }));

    // Enviar los datos como respuesta en formato JSON
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    res.status(500).json({ error: 'Hubo un problema al obtener los datos de la base de datos' });
  }
});

// Segunda gráfica - Ruta para obtener los trámites agrupados por mes y año
router.get('/tramites-mes', async (req, res) => {
  try {
    const query = `
      SELECT 
        anio,
        mes,
        COUNT(*) AS total_tramites
      FROM pqrs_data_2024_2025
      GROUP BY anio, mes
      ORDER BY anio, mes;
    `;
    
    const result = await client.query(query);
    
    const data = result.rows.map(row => ({
      anio: row.anio,
      mes: row.mes,
      total_tramites: row.total_tramites
    }));

    res.json(data);
  } catch (err) {
    console.error('Error al obtener los trámites por mes:', err);
    res.status(500).json({ error: 'Hubo un problema al obtener los datos' });
  }
});

// Tercera gráfica - Consulta por estado (FINALIZADO y ABIERTO)
router.get('/pqrs-estado', async (req, res) => {
  try {
    // Consulta para contar los registros de estado FINALIZADO y ABIERTO
    const query = `
      SELECT estado, COUNT(*) AS total
      FROM pqrs_data_2024_2025
      GROUP BY estado;
    `;
    
    const result = await client.query(query);

    // Verificamos si encontramos resultados para "FINALIZADO" y "ABIERTO"
    const totalFinalizado = result.rows.find(row => row.estado === 'FINALIZADO')?.total || 0;
    const totalAbierto = result.rows.find(row => row.estado === 'ABIERTO')?.total || 0;
    
    // Calcular el total de todos los registros
    const total = totalFinalizado + totalAbierto;
    
    // Si no hay registros, asignamos un porcentaje de 0
    const finalizadoPercentage = total === 0 ? 0 : ((totalFinalizado / total) * 100).toFixed(2);
    const abiertoPercentage = total === 0 ? 0 : ((totalAbierto / total) * 100).toFixed(2);

    // Enviar los datos con los totales y los porcentajes en formato JSON
    res.json({
      finalizado: {
        total: totalFinalizado,
        percentage: finalizadoPercentage,
      },
      abierto: {
        total: totalAbierto,
        percentage: abiertoPercentage,
      },
    });
  } catch (err) {
    console.error('Error al obtener los datos por estado:', err);
    res.status(500).json({ error: 'Hubo un problema al obtener los datos de la base de datos' });
  }
});

module.exports = router;
