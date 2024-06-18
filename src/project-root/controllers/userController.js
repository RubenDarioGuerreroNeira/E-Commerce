const { generateToken } = require('./../helpers/jwtHelper'); // Asegúrate de tener el módulo jwtHelper creado

const pool = require('../config/database');

const getUsers = async (req, res, next) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    client.release();
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
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
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    client.release();

    if (result.rows.length > 0) {
      // Generar token JWT
      const token = generateToken(email, password); // Llama a la función que genera el token

      res.json({ token });
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const newUser = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [newUser.email, newUser.name, newUser.password, newUser.address, newUser.phone, newUser.country, newUser.city]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
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
};

module.exports = {
  getUsers,
  getUserById,
  loginUser,
  createUser,
  deleteUser,
};




// const pool = require('../config/database');

// const getUsers = async (req, res, next) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users');
//     client.release();
//     res.json(result.rows);
//   } catch (err) {
//     next(err);
//   }
// };

// const getUserById = async (req, res, next) => {
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
// };

// const createUser = async (req, res, next) => {
//   const newUser = req.body;
//   try {
//     const client = await pool.connect();
//     const result = await client.query(
//       'INSERT INTO users (email, name, password, address, phone, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//       [newUser.email, newUser.name, newUser.password, newUser.address, newUser.phone, newUser.country, newUser.city]
//     );
//     client.release();
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     next(err);
//   }
// };

// const deleteUser = async (req, res, next) => {
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
//     next(err);
//   }
// };

// module.exports = {
//   getUsers,
//   getUserById,
//   createUser,
//   deleteUser,
// };
