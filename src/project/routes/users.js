
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al obtener usuarios
 */
router.get('/', async (req, res, next) => {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
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
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error al crear el usuario
 */
router.post('/', async (req, res, next) => {
  const { email, name, password, address, phone, country, city } = req.body;
  try {
    await client.connect();
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [email, name, hashedPassword, address, phone, country, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

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
 *             $ref: '#/components/schemas/sigin'
 *     responses:
 *       200:
 *         description: Éxito al iniciar sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación JWT
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
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
 *           required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Éxito al obtener el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/:id', async (req, res, next) => {
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
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para eliminar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete('/:userId', authMiddleware, async (req, res, next) => {
  const { userId } = req.params;
  try {
    await client.connect();
    const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      client.release();
      return res.status(404).send('Usuario no encontrado');
    }
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    client.release();
    res.send('Usuario eliminado exitosamente');
  } catch (err) {
    next(err);
  }
});

module.exports = router;


// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
 
//  //------------------
//  const { Client } = require('pg');

//  const client = new Client({
//    user: process.env.DB_USER,
//    host: process.env.DB_HOST,
//    database: process.env.DB_NAME,
//    password: process.env.DB_PASSWORD,
//    port: process.env.DB_PORT,
//    ssl: {
//      rejectUnauthorized: false,
//    },
//  });
//  //-----------------


// const { authMiddleware } = require('../middleware/auth');

// const router = express.Router();

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

// // router.get('/', async (req, res, next) => {
// //   try {
// //     const client = await pool.connect();
// //     const result = await client.query('SELECT * FROM users');
// //     client.release();
// //     res.json(result.rows);
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// router.get('/', async (req, res, next) => {
//   try {
//     await client.connect();
//     const result = await client.query('SELECT * FROM users');
//      res.json(result.rows);
//   } catch (err) {
//     next(err);
//   }
// });



// /**
//  * @swagger
//  * Add User:
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
// // router.post('/', async (req, res, next) => {
// //   const newUser = req.body;

// //   try {
// //     const hashedPassword = await bcrypt.hash(newUser.password, 10);
// //     await client.connect();
// //     const result = await client.query(
// //       'INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
// //       [newUser.email, newUser.name, hashedPassword, newUser.address, newUser.phone, newUser.country, newUser.city]
// //     );
// //     // client.release();

// //     res.status(201).json(result.rows[0]);
// //   } catch (err) {
// //     next(err);
// //   }
// // });
// router.post('/', async (req, res, next) => {
//   const { email, name, password, address, phone, country, city } = req.body;
   
//   try {
//     await client.connect();
//     // Verificar si el usuario ya existe
//     const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rowCount > 0) {
//       return res.status(400).json({ error: 'El usuario ya existe' });
//     }

//     // Hashear la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insertar el nuevo usuario
//     const result = await client.query(
//       'INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//       [email, name, hashedPassword, address, phone, country, city]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     next(err);
//   }
// });


// /** @swagger
//  * /login:
//  *   post:
//  *     summary: Inicia sesión y obtiene un token de autenticación
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/sigin'
//  *     responses:
//  *       '200':
//  *         description: Éxito al iniciar sesión
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 token:
//  *                   type: string
//  *                   description: Token de autenticación JWT
//  *       '401':
//  *         description: Credenciales incorrectas
//  *       '500':
//  *         description: Error al iniciar sesión
//  */

// router.post('/login', async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     client.release();

//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       if (await bcrypt.compare(password, user.password)) {
//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//       } else {
//         res.status(401).send('Credenciales incorrectas');
//       }
//     } else {
//       res.status(401).send('Credenciales incorrectas');
//     }
//   } catch (err) {
//     next(err);
//   }
// });


// /**
//  * @swagger
//  * Get User By Id:
//  *   get:
//  *     summary: Obtiene un usuario por su ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *           required: true
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
// router.get('/:id', async (req, res, next) => {
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
//   }
// });




// /**
//  * @swagger
//  * /:userId
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

// router.delete('/:userId', authMiddleware, async (req, res, next) => {
//   const { userId } = req.params;

//   try {
//     await client.connect();
//     const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
//     const user = userResult.rows[0];

//     if (!user) {
//       client.release();
//       return res.status(404).send('Usuario no encontrado');
//     }

//     await client.query('DELETE FROM users WHERE id = $1', [userId]);
//     client.release();

//     res.send('Usuario eliminado exitosamente');
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;