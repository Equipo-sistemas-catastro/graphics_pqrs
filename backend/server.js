const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const pqrsRoutes = require("./routes/pqrs");


const app = express();

// Habilitar CORS y bodyParser (usando express.json() solo)
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', pqrsRoutes); // Rutas de PQRS

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Inicializar servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
