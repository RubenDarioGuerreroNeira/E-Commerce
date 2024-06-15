const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'root',
  host: '35.227.164.209',
  database: 'proyecto_5qko',
  password: 'GzInv8S6vPS4VhSAwBIyBmzstt72oVWV',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tu_tabla'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});