const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bcrypt = require('bcrypt'); // For secure password hashing
const jwt = require('jsonwebtoken');

const cors = require('cors');

const app = express();
const port = 11900;
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
app.delete('/users/:id', async (req, res, next) => {
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
    next(err);
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'example@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Credenciales inválidas
 *       '500':
 *         description: Error en el servidor
 */

// app.post('/login', async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     client.release();

//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       const match = await bcrypt.compare(password, user.password);

//       if (match) {
//         const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
//         res.json({ token });
//       } else {
//         res.status(400).send('Credenciales inválidas');
//       }
//     } else {
//       res.status(400).send('Credenciales inválidas');
//     }
//   } catch (err) {
//     next(err);
//   }
// });

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Comparar contraseñas directamente (No recomendado para producción)
      if (password === user.password) {
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(400).send('Credenciales inválidas');
      }
    } else {
      res.status(400).send('Credenciales inválidas');
    }
  } catch (err) {
    next(err);
  }
});


app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});


// ------------------login con bycrpt-------------------------------
// const express = require('express');
// const { Pool } = require('pg');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const bcrypt = require('bcrypt'); // For secure password hashing
// const jwt = require('jsonwebtoken');

// const cors = require('cors');

// const app = express();
// const port = 11900;
// app.use(express.json());


// app.use(cors({
//   origin: 'https://11900-idx-pm4-rubendarioguerreroneira-1718250051901.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
//   methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
//   credentials: true
// }));

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
//     components: {
//       schemas: {
//         User: {
//           type: 'object',
//           properties: {
//             email: { type: 'string' ,format:'email',example:'3CqFP@example.com' },
//             name: { type: 'string',example:'Antonio Suarez' },
//             password: { type: 'string',example:'*Pasd85Poa' },
//             confirmPassword: { type: 'string',example:'*Pasd85Poa' },
//             address:{type:'string',example:'street 48,85-96'},
//             phone:{type:'number',example:'74125874'},
//             country:{type:'string',example:'Colombia'},
//             city:{type:'string',example:'Bogotá'},
          
//             },
//            required:['email','name','password','confirmPassword','address','phone','country','city']   
//         },
//       },
//     },
//   },


  

  
//   apis: ['index3.js'],  // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
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
//  *               
  
  
//  *       500:
//  *         description: Error al obtener usuarios
//  */
// app.get('/users', async (req, res,next) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users'); // Reemplaza 'users' con el nombre de tu tabla de usuarios
//     client.release(); // Importante liberar el cliente de la conexión

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     // res.status(500).send('Error al obtener usuarios');
//     next(err);
//   }
// });



// /**
//  * @swagger
//  * /users/{id}:
//  *   get:
//  *     summary: Obtiene un usuario por su ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: ID del usuario a obtener
//  *     responses:
//  *       '200':
//  *         description: Éxito al obtener el usuario
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       '404':
//  *         description: Usuario no encontrado
//  *       '500':
//  *         description: Error al obtener el usuario
//  */
// app.get('/users/:id', async (req, res,next) => {
//   const userId = req.params.id;

//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
//     client.release();

//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);
//     } else {
//       res.status(404).send('Usuario no encontrado');
//     }
//   } catch (err) {
//     next(err);
//     // res.status(500).send('Error al obtener el usuario');
//   }
// });




// /**
//  * @swagger
//  * /users:
//  *   post:
//  *     summary: Agrega un nuevo usuario
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       '201':
//  *         description: Usuario creado exitosamente
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       '400':
//  *         description: El usuario ya existe
//  *       '500':
//  *         description: Error al crear el usuario
//  */
// app.post('/users', async (req, res,next) => {
//   const newUser = req.body;
//   console.log(req.body)

//   try {
//     const client = await pool.connect();
//     const result = await client.query('INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [newUser.email, newUser.name, newUser.password, newUser.address, newUser.phone, newUser.country, newUser.city]);
//     client.release();

//     res.status(201).json(result.rows[0]);
    
//   } catch (err) {
//     next(err);
//     // res.status(500).send('Error al crear el usuario');
//   }
// });

// /**
//  * @swagger
//  * /users/{id}:
//  *   delete:
//  *     summary: Elimina un usuario por su ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: ID del usuario a eliminar
//  *     responses:
//  *       '204':
//  *         description: Usuario eliminado exitosamente
//  *       '404':
//  *         description: Usuario no encontrado
//  *       '500':
//  *         description: Error al eliminar el usuario
//  */
// app.delete('/users/:id', async (req, res,next) => {
//   const userId = req.params.id;

//   try {
//     const client = await pool.connect();
//     const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

//     if (result.rows.length > 0) {
//       res.status(204).send('Usuario eliminado exitosamente');
//     } else {
//       res.status(404).send('Usuario no encontrado');
//     }

//     client.release();
//   } catch (err) {
//     // console.error(err);
//     // res.status(500).send('Error al eliminar el usuario');
//     next(err);
//   }
// });





// // 
// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
//   console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
// });