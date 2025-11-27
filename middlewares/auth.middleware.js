const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eco-uaz-secret-key-2024';

/**
 * Middleware para verificar token JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Token de autenticación requerido'
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: true,
          message: 'Token inválido o expirado'
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Error al verificar autenticación'
    });
  }
};

/**
 * Middleware opcional que no requiere autenticación pero si existe token lo verifica
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
