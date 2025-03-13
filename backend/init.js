// backend/init.js
const client = require('./db');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS pqrsUsers (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

client.query(createTableQuery)
  .then(() => console.log('Tabla pqrsUsers creada exitosamente'))
  .catch(err => console.error('Error al crear la tabla:', err))
  .finally(() => client.end());
