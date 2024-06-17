// Importa los módulos necesarios
const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { UsersService } = require('../ecommerce/dist/src/Users/users.service');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { Role } = require('../ecommerce/dist/src/roles.enum');
const { Users } = require('../ecommerce/dist/src/Entities/Users.entity');

const app = express();
const port =5500;
const router = express.Router();
const usersService = new UsersService();

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
      title: 'E-Commerce',
      version: '1.0.0',
      description: 'Documentación de la API del Proyecto',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./index2.js'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importa el controlador de usuarios y crea una instancia del servicio de usuarios
const { UsersController } = require('././dist/src/Users/users.controllers');
const usersController = new UsersController(new UsersService(pool));



router.get('/users/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await usersService.getByemail(email);
    if (!user) {
      res.status(404).send('Usuario no encontrado');
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).send('Error al obtener usuario por email');
  }
});


// Rutas para usuarios
app.post('/users', (req, res) => usersController.create(req, res));
app.get('/users', (req, res) => usersController.getUsers(req, res));
app.get('/users/:id', (req, res) => usersController.getUserById(req, res));
app.delete('/users/:id', (req, res) => usersController.DeleteId(req, res));
app.put('/users/:id', (req, res) => usersController.updateUser(req, res));
app.get('/users/email/:email', (req, res) => usersController.getUserByEmail(req, res));

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
//   apis: ['./index2.js'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Obtiene todos los usuarios
//  *     responses:
//  *       200:
//  *         description: Éxito al obtener usuarios
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *       500:
//  *         description: Error al obtener usuarios
//  */
// app.get('/users', async (req, res) => {
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM users'); // Reemplaza 'users' con el nombre de tu tabla de usuarios
//       client.release(); // Importante liberar el cliente de la conexión
  
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error al obtener usuarios');
//     }
//   });

// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
//   console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
// });