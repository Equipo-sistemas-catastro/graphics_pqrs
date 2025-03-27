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


// Cuarta Gráfica - PQRS pendientes, vencidos
router.get('/estado-atempt', async (req, res) => {
  try {
    const query = `
      SELECT 
        SUM(pendiente) AS pendiente,
        SUM(vencidos) AS vencidos,
        SUM(a_tiempo) AS a_tiempo,
        SUM(oportuno) AS oportuno,
        SUM(no_oportuno) AS no_oportuno
      FROM pqrs_data_2024_2025;
    `;
    
    const result = await client.query(query);
    
    // Asegurar que haya resultados
    if (result.rows.length === 0) {
      return res.json({ pendiente: 0, vencidos: 0, a_tiempo: 0, oportuno: 0, no_oportuno: 0 });
    }

    // Devolver los datos con las claves correctas
    const row = result.rows[0];
    const data = {
      pendiente: row.pendiente || 0,
      vencidos: row.vencidos || 0,
      a_tiempo: row.a_tiempo || 0,
      oportuno: row.oportuno || 0,
      no_oportuno: row.no_oportuno || 0
    };

    res.json(data);
  } catch (err) {
    console.error('Error al obtener los datos de estado:', err);
    res.status(500).json({ error: 'Hubo un problema al obtener los datos de estado' });
  }
});


// Quinta Gráfica - Tema
router.get('/pqrs-tema', async (req, res) => {
  try {
    const query = `
      SELECT tema, COUNT(*) AS total
      FROM pqrs_data_2024_2025
      GROUP BY tema
      ORDER BY total DESC;
    `;

    const result = await client.query(query);

    // Formatear los datos en JSON
    const data = result.rows.map(row => ({
      tema: row.tema,
      total: parseInt(row.total, 10)  // Convertir a número
    }));

    res.json(data);
  } catch (err) {
    console.error('Error al obtener los datos de temas:', err);
    res.status(500).json({ error: 'Hubo un problema al obtener los datos' });
  }
});

// Aca va la logica de la gráfica 6
// Sexta Gráfica - Oportuno vs No Oportuno por Mes y Año
router.get('/estado-oportuno', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        anio, 
        mes, 
        SUM(CASE WHEN oportunidad = 'OPORTUNO' THEN 1 ELSE 0 END) AS oportuno,
        SUM(CASE WHEN oportunidad = 'NO OPORTUNO' THEN 1 ELSE 0 END) AS no_oportuno,
        SUM(CASE WHEN oportunidad = 'A TIEMPO' THEN 1 ELSE 0 END) AS a_tiempo
      FROM pqrs_data_2024_2025
      GROUP BY anio, mes
      ORDER BY anio, mes;
    `);

    const data = result.rows.map(row => ({
      anio: row.anio,
      mes: row.mes,
      oportuno: row.oportuno,
      no_oportuno: row.no_oportuno,
      a_tiempo: row.a_tiempo
    }));

    res.json(data);
  } catch (err) {
    console.error('Error al obtener datos:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Septima gráfica
router.get('/estados-oportunidad-pqrs', async (req, res) => {
  try {
    const query = `
      SELECT 
        mes,
        anio,
        estado,
        oportunidad,
        COUNT(*) AS total
      FROM pqrs_data_2024_2025
      WHERE estado IN ('ABIERTO', 'FINALIZADO')
      GROUP BY mes, anio, estado, oportunidad
      ORDER BY anio, mes, estado, oportunidad;
    `;
    
    const result = await client.query(query);
    res.json(result.rows);  // Retorna los datos agrupados
  } catch (error) {
    console.error("Error al obtener los datos de la gráfica", error.message);  // Mostrar solo el mensaje de error
    console.error(error);  // Mostrar el objeto de error completo para más detalles
    res.status(500).send("Error en la consulta");
  }
});


// Nueva ruta para la gráfica de oportunidad por tema
router.get('/estadisticas-oportunidad-por-tema', async (req, res) => {
  try {
      const query = `
          SELECT 
              tema, 
              oportunidad, 
              COUNT(*) as cantidad
          FROM 
              pqrs_data_2024_2025
          WHERE 
              oportunidad IN ('OPORTUNO', 'NO OPORTUNO', 'A TIEMPO')
          GROUP BY 
              tema, oportunidad
          ORDER BY 
              tema, oportunidad;
      `;
      const result = await client.query(query);
      res.json(result.rows); // Ajusta según tu driver de DB (puede ser result.rows, result[0], etc.)
  } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).send('Error interno del servidor');
  }
});

// Nueva ruta en pqrs.js
router.get('/solicitantes-clases', async (req, res) => {
  try {
    // Consulta para contar solicitantes
    const solicitantesQuery = `
      SELECT solicitante, COUNT(*) as cantidad
      FROM pqrs_data_2024_2025
      GROUP BY solicitante
      ORDER BY cantidad DESC
    `;

    // Consulta para contar clases de solicitud
    const clasesQuery = `
      SELECT clase_de_solicitud as clase, COUNT(*) as cantidad
      FROM pqrs_data_2024_2025
      GROUP BY clase_de_solicitud
      ORDER BY cantidad DESC
    `;

    const [solicitantesRes, clasesRes] = await Promise.all([
      client.query(solicitantesQuery),
      client.query(clasesQuery)
    ]);

    res.json({
      solicitantes: solicitantesRes.rows,
      clases: clasesRes.rows
    });
  } catch (error) {
    console.error('Error en consulta:', error);
    res.status(500).send('Error al obtener datos');
  }
});


module.exports = router;


// Séptima Gráfica - PQRS Abierto-Oportuno y Abierto-No Oportuno, Abierto-A Tiempo, PQRS Finalizado-Oportuno, Finalizado-No Oportuno, Finalizado-A Tiempo.




// Tercera gráfica - Consulta por estado (FINALIZADO y ABIERTO)
/* router.get('/pqrs-estado', async (req, res) => {
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
}); */

module.exports = router;
