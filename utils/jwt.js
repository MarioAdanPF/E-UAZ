const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eco-uaz-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Usuario con id y username
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
