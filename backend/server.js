// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const pqrsRoutes = require("./routes/pqrs");

const app = express();

// Habilitar CORS y bodyParser
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', pqrsRoutes); // Se mueve arriba del listen

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

// Inicializar servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});