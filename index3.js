
const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 11900;

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
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            password: { type: 'string' },
            confirmPassword: { type: 'string' },
            address:{type:'string'},
            phone:{type:'number'},
            country:{type:'string'},
            city:{type:'string'},

           
            },
             ID: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },

            // Agrega aquí los demás campos del usuario

            
          },
        },
      },
    },
  },


  

  
  apis: ['index3.js'],  // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
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
app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users'); // Reemplaza 'users' con el nombre de tu tabla de usuarios
    client.release(); // Importante liberar el cliente de la conexión

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuarios');
  }
});



/**
 * @swagger
 * /users/{id}:
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
app.get('/users/:id', async (req, res) => {
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
    console.error(err);
    res.status(500).send('Error al obtener el usuario');
  }
});




/**
 * @swagger
 * /users:
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
app.post('/users', async (req, res) => {
  const newUser = req.body;

  try {
    const client = await pool.connect();
    // Verificar si el usuario ya existe por su email
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
    if (existingUser.rows.length > 0) {
      res.status(400).send('El usuario ya existe');
      return;
    }

    // Si el usuario no existe, se procede a insertarlo
    const result = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [newUser.name, newUser.email]);
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear el usuario');
  }
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       '204':
 *         description: Usuario eliminado exitosamente
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error al eliminar el usuario
 */
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length > 0) {
      res.status(204).send('Usuario eliminado exitosamente');
    } else {
      res.status(404).send('Usuario no encontrado');
    }

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el usuario');
  }
});



/** DELETE ADMIN
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID (requiere rol de super administrador)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       '204':
 *         description: Usuario eliminado exitosamente
 *       '401':
 *         description: No autorizado para eliminar el usuario
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error al eliminar el usuario
 */
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const client = await pool.connect();
    const user = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      res.status(404).send('Usuario no encontrado');
      return;
    }

    const isAdmin = user.rows[0].isadmin;
    if (!isAdmin) {
      res.status(401).send('No autorizado para eliminar el usuario');
      return;
    }

    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length > 0) {
      res.status(204).send('Usuario eliminado exitosamente');
    } else {
      res.status(404).send('Usuario no encontrado');
    }

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el usuario');
  }
});

// GENERA TOKEN DE AUTENTICACIÓN
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión y generar token de autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso, se devuelve el token de autenticación
 *       '401':
 *         description: Credenciales inválidas
 *       '500':
 *         description: Error al iniciar sesión
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      res.status(401).send('Credenciales inválidas');
      return;
    }

    const hashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      res.status(401).send('Credenciales inválidas');
      return;
    }

    const token = jwt.sign({ email: user.rows[0].email, isAdmin: user.rows[0].isAdmin }, 'your_secret_key', { expiresIn: '1h' });
    
    res.status(200).json({ token });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
});


app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});