const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contribution.controller');
const { authenticateToken, optionalAuth } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/contributions
 * @desc    Obtener todas las contribuciones (con paginación)
 * @access  Public
 */
router.get('/', contributionController.getAllContributions);

/**
 * @route   GET /api/contributions/search
 * @desc    Buscar contribuciones por descripción
 * @access  Public
 */
router.get('/search', contributionController.searchContributions);

/**
 * @route   GET /api/contributions/my
 * @desc    Obtener contribuciones del usuario autenticado
 * @access  Private
 */
router.get('/my', authenticateToken, contributionController.getMyContributions);

/**
 * @route   POST /api/contributions
 * @desc    Crear nueva contribución
 * @access  Private
 */
router.post('/', authenticateToken, contributionController.createContribution);

/**
 * @route   GET /api/contributions/:id
 * @desc    Obtener una contribución por ID
 * @access  Public
 */
router.get('/:id', contributionController.getContributionById);

/**
 * @route   PUT /api/contributions/:id
 * @desc    Actualizar una contribución
 * @access  Private
 */
router.put('/:id', authenticateToken, contributionController.updateContribution);

/**
 * @route   DELETE /api/contributions/:id
 * @desc    Eliminar una contribución
 * @access  Private
 */
router.delete('/:id', authenticateToken, contributionController.deleteContribution);

module.exports = router;
