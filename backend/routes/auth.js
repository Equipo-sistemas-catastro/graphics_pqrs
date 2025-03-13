const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Verificar si el usuario ya existe por email o nombre de usuario
  const checkQuery = 'SELECT * FROM pqrsUsers WHERE email = $1 OR username = $2';
  try {
    const checkResult = await client.query(checkQuery, [email, username]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario o correo electrónico ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO pqrsUsers (fullName, username, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, fullName, username, email;
    `;
    
    const result = await client.query(query, [fullName, username, email, hashedPassword]);
    const newUser = result.rows[0];
    
    // Enviar respuesta con detalles del nuevo usuario
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM pqrsUsers WHERE email = $1';
  try {
    const result = await client.query(query, [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
