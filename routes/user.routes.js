const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Public
 */
router.get('/', userController.getAllUsers);

/**
 * @route   GET /api/users/ranking
 * @desc    Obtener ranking de usuarios por contribuciones
 * @access  Public
 */
router.get('/ranking', userController.getRanking);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID con sus contribuciones
 * @access  Public
 */
router.get('/:id', userController.getUserById);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Obtener estadísticas de un usuario
 * @access  Public
 */
router.get('/:id/stats', userController.getUserStats);

module.exports = router;
