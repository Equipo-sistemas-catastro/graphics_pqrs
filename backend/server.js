// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');


// Habilitar CORS para permitir que el frontend consuma esta API
app.use(cors());
app.use(bodyParser.json());

// Middleware para manejar JSON
app.use(express.json());

// Ruta API de ejemplo
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.use('/api/auth', authRoutes);  // Ruta para autenticación

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
