const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bcrypt = require('bcrypt'); // For secure password hashing
require('dotenv').config(); // Carga las variables de entorno
const jwt = require('jsonwebtoken');



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
            id: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
            email: { type: 'string', format: 'email', example: 'demo14@hotmail.com' },
            name: { type: 'string', example: 'Antonio Suarez' },
            password: { type: 'string', example: '*aMisterMag*03' },
            confirmPassword: { type: 'string', example: '*aMisterMag*03' },
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
  apis: ['index4.js'],  // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
};




const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Éxito al obtener usuarios
 *         content:
 *           application/json:
 *             schema:
 *       
 *       500:
 *         description: Error al obtener usuarios
 */
app.get('/users', async (req, res, next) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users'); // Reemplaza 'users' con el nombre de tu tabla de usuarios
    client.release(); // Importante liberar el cliente de la conexión

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * @swagger
 * Get User By Id:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       '200':
 *         description: Éxito al obtener el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error al obtener el usuario
 */
app.get('/users/:id', async (req, res, next) => {
  const userId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    client.release();

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    next(err);
  }
});




/**
 * @swagger
 * Add User:
 *   post:
 *     summary: Agrega un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: El usuario ya existe
 *       '500':
 *         description: Error al crear el usuario
 */
app.post('/users', async (req, res, next) => {
  const newUser = req.body;
  console.log(req.body)

  try {
    const hashedPassword = await bcrypt.hash(newUser.password, 10); // Hash the password
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [newUser.email, newUser.name, hashedPassword, newUser.address, newUser.phone, newUser.country, newUser.city]);
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});


/** @swagger
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

// elikina 1--
// /**
//  * @swagger
//  * Dlete User:
//  *   delete:
//  *     summary: Elimina un usuario
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string   
//  *     responses:
//  *       '200':
//  *         description: Usuario eliminado exitosamente
//  *       '401':
//  *         description: No autorizado
//  *       '403':
//  *         description: No tiene permisos para eliminar usuarios
//  *       '404':
//  *         description: Usuario no encontrado
//  *       '500':
//  *         description: Error al eliminar el usuario
//  */
// app.delete('/users/:userId', async (req, res, next) => {
//   const { userId } = req.params;
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).send('No autorizado');
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

//     const client = await pool.connect();
//     const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
//     const user = userResult.rows[0];

//     if (!user) {
//       client.release();
//       return res.status(404).send('Usuario no encontrado');
//     }

//     if (!user.isAdmin) {
//       client.release();
//       return res.status(403).send('No tiene permisos para eliminar usuarios');
//     }

//     await client.query('DELETE FROM users WHERE id = $1', [userId]);
//     client.release();

//     res.send('Usuario eliminado exitosamente');
//   } catch (err) {
//     next(err);
//   }
// });


/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Elimina un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string   
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: No tiene permisos para eliminar usuarios
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error al eliminar el usuario
 */
app.delete('/users/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('No autorizado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    const client = await pool.connect();
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      client.release();
      return res.status(404).send('Usuario no encontrado');
    }

    if (!user.isAdmin) {
      client.release();
      return res.status(403).send('No tiene permisos para eliminar usuarios');
    }

    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    client.release();

    res.send('Usuario eliminado exitosamente');
  } catch (err) {
    next(err);
  }
});






app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});
