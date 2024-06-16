const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');

const app = express();
const port = 4999;

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

// Configuración de Swagger
const swaggerOptions = new DocumentBuilder()
  .setTitle('E-Commerce M04 HENRY')
  .setDescription('P.I MODULE 04 HENRY')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const swaggerDocs = swaggerJsdoc({
  swaggerDefinition: swaggerOptions,
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2401945418.
  apis: ['./index.js','./app.module.ts'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Obtiene datos de la tabla
 *     responses:
 *       200:
 *         description: Éxito al obtener datos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error al obtener datos
 */
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
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});




// const express = require('express');
// const { Pool } = require('pg');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const app = express();
// const port = 4999;

// const pool = new Pool({
//   user: 'root',
//   host: '35.227.164.209',
//   database: 'proyecto_5qko',
//   password: 'GzInv8S6vPS4VhSAwBIyBmzstt72oVWV',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// // Configuración de Swagger
// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'API de Proyecto',
//       version: '1.0.0',
//       description: 'Documentación de la API del Proyecto',
//     },
//     servers: [
//       {
//         url: `http://localhost:${port}`,
//       },
//     ],
//   },
//   apis: ['./index.js'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /data:
//  *   get:
//  *     summary: Obtiene datos de la tabla
//  *     responses:
//  *       200:
//  *         description: Éxito al obtener datos
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *       500:
//  *         description: Error al obtener datos
//  */
// app.get('/data', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tu_tabla'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al obtener datos');
//   }
// });

// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
//   console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
// });




