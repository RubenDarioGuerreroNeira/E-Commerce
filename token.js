const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config(); // Carga las variables de entorno
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga las variables de entorno

const cors = require('cors');

const app = express();
const port = 14800;
app.use(express.json());

app.use(cors({
  origin: 'https://11900-idx-pm4-rubendarioguerreroneira-1718250051901.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
  credentials: true
}));

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
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Proyecto',
      version: '1.0.0',
      description: 'Documentación de la API del Proyecto',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: '3CqFP@example.com' },
            name: { type: 'string', example: 'Antonio Suarez' },
            password: { type: 'string', example: '*Pasd85Poa' },
            confirmPassword: { type: 'string', example: '*Pasd85Poa' },
            address: { type: 'string', example: 'street 48,85-96' },
            phone: { type: 'number', example: '74125874' },
            country: { type: 'string', example: 'Colombia' },
            city: { type: 'string', example: 'Bogotá' },
          },
          required: ['email', 'name', 'password', 'confirmPassword', 'address', 'phone', 'country', 'city']
        },
      },
    },
  },
  apis: ['index5.js'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión y obtiene un token de autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Éxito al iniciar sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación JWT
 *       '401':
 *         description: Credenciales incorrectas
 *       '500':
 *         description: Error al iniciar sesión
 */
app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (password === user.password) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});
