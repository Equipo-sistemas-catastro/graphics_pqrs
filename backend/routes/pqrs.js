const express = require('express');
const router = express.Router();
const client = require('../db');

// Ruta para obtener los datos de pqrs (fecha_de_ingreso y estado)
router.get('/pqrs', async (req, res) => {
  try {
    // Consulta para contar el número de registros por estado (FINALIZADO y ABIERTO) por fecha_de_ingreso
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

module.exports = router;
