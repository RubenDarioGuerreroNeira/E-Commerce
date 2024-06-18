const jwt = require('jsonwebtoken');

const secretKey = 'tu_clave_secreta'; // Cambia esto por una clave secreta segura

const generateToken = (email, password) => {
  const tokenPayload = {
    email,
    password,
  };

  // Genera el token con una firma usando la clave secreta y un tiempo de expiración (opcional)
  const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' }); // El token expirará en 1 hora

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null; // El token no es válido
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
