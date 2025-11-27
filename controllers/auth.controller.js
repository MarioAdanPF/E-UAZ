const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    // Validaciones
    if (!username || !name || !password) {
      return res.status(400).json({
        error: true,
        message: 'Todos los campos son requeridos: username, name, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'El nombre de usuario ya está en uso'
      });
    }

    // Crear usuario
    const password_hash = await hashPassword(password);
    const user = await User.create({
      username,
      name,
      password_hash
    });

    // Generar token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al registrar usuario',
      details: error.message
    });
  }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      return res.status(400).json({
        error: true,
        message: 'Username y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al iniciar sesión',
      details: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'name', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener perfil',
      details: error.message
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: true,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }
      user.password_hash = await hashPassword(password);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al actualizar perfil',
      details: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
