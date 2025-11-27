const { User, Contribution } = require('../models');
const { Sequelize } = require('sequelize');

/**
 * Obtener todos los usuarios
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'name', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

/**
 * Obtener un usuario por ID con sus contribuciones
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'name', 'createdAt'],
      include: [{
        model: Contribution,
        as: 'contributions',
        attributes: ['id', 'description', 'images', 'createdAt'],
        order: [['createdAt', 'DESC']]
      }]
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
    console.error('Error en getUserById:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener usuario',
      details: error.message
    });
  }
};

/**
 * Obtener ranking de usuarios por número de contribuciones
 */
const getRanking = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const ranking = await User.findAll({
      attributes: [
        'id',
        'username',
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('contributions.id')), 'contributionCount']
      ],
      include: [{
        model: Contribution,
        as: 'contributions',
        attributes: [],
        required: false
      }],
      group: ['User.id'],
      order: [[Sequelize.literal('"contributionCount"'), 'DESC']],
      limit: parseInt(limit),
      subQuery: false,
      raw: true
    });

    // Convertir contributionCount a número
    const formattedRanking = ranking.map(user => ({
      ...user,
      contributionCount: parseInt(user.contributionCount) || 0
    }));

    return res.status(200).json({
      success: true,
      data: formattedRanking
    });

  } catch (error) {
    console.error('Error en getRanking:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener ranking',
      details: error.message
    });
  }
};

/**
 * Obtener estadísticas de un usuario
 */
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'name'],
      include: [{
        model: Contribution,
        as: 'contributions',
        attributes: ['id', 'createdAt']
      }]
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado'
      });
    }

    const stats = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      },
      totalContributions: user.contributions.length,
      // Calcular contribuciones por mes
      contributionsByMonth: user.contributions.reduce((acc, contribution) => {
        const month = new Date(contribution.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {}),
      // Última contribución
      lastContribution: user.contributions.length > 0 
        ? user.contributions[user.contributions.length - 1].createdAt 
        : null
    };

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error en getUserStats:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getRanking,
  getUserStats
};
