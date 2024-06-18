const { Pool } = require('pg');

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

module.exports = pool;
